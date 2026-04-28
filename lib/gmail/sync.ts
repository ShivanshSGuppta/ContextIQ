import { addMemories, buildNoteMemoryPayload } from "@/lib/hydradb/client";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Account, Contact, GmailSyncResult, Note, Workspace } from "@/types";
import {
  getValidGmailAccessToken,
  updateGmailSyncState,
} from "@/lib/gmail/integration-store";
import {
  getGmailMessageMetadata,
  listGmailMessageIds,
} from "@/lib/gmail/client";
import { logIntegrationEvent } from "@/lib/integrations/telemetry";

const DEFAULT_GMAIL_QUERY = "in:anywhere newer_than:30d -in:spam -in:trash";

function normalizeDomain(input: string | null | undefined) {
  if (!input) return null;
  return input
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .trim();
}

function extractDomain(email: string) {
  const domain = email.split("@")[1] ?? "";
  return normalizeDomain(domain);
}

function toIsoFromMaybeDate(value: string | null, fallbackIso: string) {
  if (!value) return fallbackIso;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallbackIso : parsed.toISOString();
}

export async function syncWorkspaceGmailMessages(input: {
  userId: string;
  workspace: Workspace;
  maxResults?: number;
}): Promise<GmailSyncResult> {
  const supabase = getSupabaseAdminClient();
  const maxResults = Math.min(Math.max(input.maxResults ?? 20, 1), 50);

  const tokenState = await getValidGmailAccessToken({
    workspaceId: input.workspace.id,
    userId: input.userId,
  });

  const accessToken = tokenState.accessToken;

  await updateGmailSyncState({
    workspaceId: input.workspace.id,
    userId: input.userId,
    syncStatus: "syncing",
    lastError: null,
  });

  try {
    const [{ data: accounts }, { data: contacts }, { data: existingSyncs }] = await Promise.all([
      supabase
        .from("accounts")
        .select("*")
        .eq("workspace_id", input.workspace.id),
      supabase
        .from("contacts")
        .select("*")
        .eq("workspace_id", input.workspace.id),
      supabase
        .from("gmail_message_syncs")
        .select("gmail_message_id")
        .eq("workspace_id", input.workspace.id)
        .eq("user_id", input.userId),
    ]);

    const typedAccounts = (accounts ?? []) as Account[];
    const typedContacts = (contacts ?? []) as Contact[];
    const existingMessageIds = new Set(
      ((existingSyncs ?? []) as Array<{ gmail_message_id: string }>).map(
        (row) => row.gmail_message_id,
      ),
    );

    const accountByDomain = new Map<string, Account>();
    typedAccounts.forEach((account) => {
      const domain = normalizeDomain(account.domain);
      if (domain) {
        accountByDomain.set(domain, account);
      }
    });

    const contactByEmail = new Map<string, Contact>();
    typedContacts.forEach((contact) => {
      if (contact.email) {
        contactByEmail.set(contact.email.toLowerCase(), contact);
      }
    });

    const messages = await listGmailMessageIds({
      accessToken,
      query: DEFAULT_GMAIL_QUERY,
      maxResults,
    });

    const result: GmailSyncResult = {
      fetched: messages.length,
      imported: 0,
      skipped: 0,
      failed: 0,
    };
    logIntegrationEvent({
      source: "gmail",
      event: "sync_started",
      workspaceId: input.workspace.id,
      userId: input.userId,
      detail: { fetched_candidates: messages.length },
    });

    for (const messageRef of messages) {
      if (existingMessageIds.has(messageRef.id)) {
        result.skipped += 1;
        continue;
      }

      try {
        const message = await getGmailMessageMetadata({
          accessToken,
          messageId: messageRef.id,
        });

        const involvedEmails = [...message.fromEmails, ...message.toEmails];

        const matchedContact = involvedEmails
          .map((email) => contactByEmail.get(email))
          .find(Boolean) as Contact | undefined;

        const matchedAccount =
          (matchedContact
            ? typedAccounts.find((account) => account.id === matchedContact.account_id)
            : null) ??
          involvedEmails
            .map((email) => {
              const domain = extractDomain(email);
              return domain ? accountByDomain.get(domain) : null;
            })
            .find(Boolean) ??
          null;

        if (!matchedAccount) {
          result.skipped += 1;
          continue;
        }

        const occurredAt = message.internalDate
          ? new Date(Number(message.internalDate)).toISOString()
          : toIsoFromMaybeDate(message.date, new Date().toISOString());

        const activityInsert = await supabase
          .from("activities")
          .insert({
            workspace_id: input.workspace.id,
            account_id: matchedAccount.id,
            contact_id: matchedContact?.id ?? null,
            actor_id: input.userId,
            activity_type: "email_received",
            title: message.subject?.trim() || "Email update synced from Gmail",
            description: message.snippet || null,
            occurred_at: occurredAt,
            metadata: {
              topic: "gmail_email",
              gmail_message_id: message.id,
              gmail_thread_id: message.threadId,
              gmail_label_ids: message.labelIds,
              from: message.from,
              to: message.to,
              cc: message.cc,
            },
          })
          .select("*")
          .single();

        if (activityInsert.error || !activityInsert.data) {
          throw activityInsert.error ?? new Error("Failed to insert Gmail activity.");
        }

        let createdNoteId: string | null = null;
        const noteContent = [
          message.subject ? `Subject: ${message.subject}` : null,
          message.from ? `From: ${message.from}` : null,
          message.to ? `To: ${message.to}` : null,
          message.snippet ? `Summary: ${message.snippet}` : null,
        ]
          .filter(Boolean)
          .join("\n");

        if (noteContent.length >= 12) {
          const noteInsert = await supabase
            .from("notes")
            .insert({
              workspace_id: input.workspace.id,
              account_id: matchedAccount.id,
              contact_id: matchedContact?.id ?? null,
              author_id: input.userId,
              title: message.subject?.trim() || "Email summary",
              content: noteContent,
              source_type: "email_summary",
              topic: "gmail_email",
              importance_level: "medium",
            })
            .select("*")
            .single();

          if (noteInsert.error || !noteInsert.data) {
            throw noteInsert.error ?? new Error("Failed to insert Gmail note.");
          }

          const insertedNote = noteInsert.data as Note;
          createdNoteId = insertedNote.id;

          try {
            const hydraResponse = await addMemories({
              tenantId: input.workspace.hydradb_tenant_id,
              memories: [
                buildNoteMemoryPayload({
                  note: insertedNote,
                  account: matchedAccount,
                  contact: matchedContact ?? null,
                  userId: input.userId,
                }),
              ],
            });

            const memoryId = hydraResponse.memory_ids?.[0] ?? hydraResponse.ids?.[0] ?? null;
            if (memoryId) {
              await supabase
                .from("notes")
                .update({ hydradb_memory_id: memoryId })
                .eq("id", insertedNote.id);
            }
          } catch (ingestError) {
            console.error("HydraDB Gmail note ingestion failed", ingestError);
          }
        }

        const syncInsert = await supabase.from("gmail_message_syncs").insert({
          workspace_id: input.workspace.id,
          user_id: input.userId,
          gmail_message_id: message.id,
          gmail_thread_id: message.threadId,
          account_id: matchedAccount.id,
          contact_id: matchedContact?.id ?? null,
          activity_id: activityInsert.data.id,
          note_id: createdNoteId,
        });

        if (syncInsert.error) throw syncInsert.error;

        existingMessageIds.add(message.id);
        result.imported += 1;
      } catch (messageError) {
        console.error("Gmail message sync failed", messageError);
        result.failed += 1;
      }
    }

    await updateGmailSyncState({
      workspaceId: input.workspace.id,
      userId: input.userId,
      syncStatus: "ok",
      lastSyncedAt: new Date().toISOString(),
      lastError: null,
    });
    logIntegrationEvent({
      source: "gmail",
      event: "sync_completed",
      workspaceId: input.workspace.id,
      userId: input.userId,
      detail: {
        fetched: result.fetched,
        imported: result.imported,
        skipped: result.skipped,
        failed: result.failed,
      },
    });

    return result;
  } catch (error) {
    await updateGmailSyncState({
      workspaceId: input.workspace.id,
      userId: input.userId,
      syncStatus: "error",
      lastError: error instanceof Error ? error.message : "Gmail sync failed.",
    });
    logIntegrationEvent({
      source: "gmail",
      event: "sync_failed",
      workspaceId: input.workspace.id,
      userId: input.userId,
      detail: {
        message: error instanceof Error ? error.message : "Gmail sync failed.",
      },
    });
    throw error;
  }
}
