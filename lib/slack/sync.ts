import { addMemories, buildNoteMemoryPayload } from "@/lib/hydradb/client";
import { logIntegrationEvent } from "@/lib/integrations/telemetry";
import {
  listSlackChannelMessages,
  listSlackConversations,
} from "@/lib/slack/client";
import {
  getDecryptedSlackIntegration,
  updateSlackSyncState,
} from "@/lib/slack/integration-store";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Account, Contact, Note, SlackSyncResult, Workspace } from "@/types";

function normalizeDomain(input: string | null | undefined) {
  if (!input) return null;
  return input
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .trim();
}

function extractPossibleEmails(value: string) {
  const matches = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
  return [...new Set(matches.map((email) => email.toLowerCase()))];
}

export async function syncWorkspaceSlackSignals(input: {
  userId: string;
  workspace: Workspace;
  maxChannels?: number;
  maxMessagesPerChannel?: number;
}): Promise<SlackSyncResult> {
  const supabase = getSupabaseAdminClient();
  const maxChannels = Math.min(Math.max(input.maxChannels ?? 8, 1), 20);
  const maxMessagesPerChannel = Math.min(Math.max(input.maxMessagesPerChannel ?? 10, 1), 25);

  const integration = await getDecryptedSlackIntegration({
    workspaceId: input.workspace.id,
    userId: input.userId,
  });

  if (!integration) {
    throw new Error("Slack is not connected. Connect Slack first.");
  }

  const accessToken = integration.user_access_token ?? integration.bot_access_token;
  const usingBotFallback = !integration.user_access_token && Boolean(integration.bot_access_token);
  if (!accessToken) {
    throw new Error("Slack token missing. Reconnect Slack.");
  }

  await updateSlackSyncState({
    workspaceId: input.workspace.id,
    userId: input.userId,
    syncStatus: "syncing",
    lastError: null,
  });

  try {
    const [{ data: accounts }, { data: contacts }, { data: existingSyncs }] = await Promise.all([
      supabase.from("accounts").select("*").eq("workspace_id", input.workspace.id),
      supabase.from("contacts").select("*").eq("workspace_id", input.workspace.id),
      supabase
        .from("slack_message_syncs")
        .select("slack_channel_id,slack_message_ts")
        .eq("workspace_id", input.workspace.id)
        .eq("user_id", input.userId),
    ]);

    const typedAccounts = (accounts ?? []) as Account[];
    const typedContacts = (contacts ?? []) as Contact[];

    const accountByDomain = new Map<string, Account>();
    typedAccounts.forEach((account) => {
      const domain = normalizeDomain(account.domain);
      if (domain) accountByDomain.set(domain, account);
    });

    const contactByEmail = new Map<string, Contact>();
    typedContacts.forEach((contact) => {
      if (contact.email) contactByEmail.set(contact.email.toLowerCase(), contact);
    });

    const existingKeys = new Set(
      ((existingSyncs ?? []) as Array<{ slack_channel_id: string; slack_message_ts: string }>).map(
        (row) => `${row.slack_channel_id}:${row.slack_message_ts}`,
      ),
    );

    const channels = await listSlackConversations({
      accessToken,
      maxChannels,
    });

    const result: SlackSyncResult = {
      scanned: 0,
      imported: 0,
      skipped: 0,
      failed: 0,
    };

    for (const channel of channels) {
      const messages = await listSlackChannelMessages({
        accessToken,
        channelId: channel.id,
        limit: maxMessagesPerChannel,
      });

      for (const message of messages) {
        result.scanned += 1;
        const syncKey = `${channel.id}:${message.id}`;
        if (existingKeys.has(syncKey)) {
          result.skipped += 1;
          continue;
        }

        try {
          const emails = extractPossibleEmails(message.text);
          const matchedContact = emails
            .map((email) => contactByEmail.get(email))
            .find(Boolean) as Contact | undefined;

          const matchedAccount =
            (matchedContact
              ? typedAccounts.find((account) => account.id === matchedContact.account_id)
              : null) ??
            emails
              .map((email) => {
                const domain = normalizeDomain(email.split("@")[1] ?? "");
                return domain ? accountByDomain.get(domain) : null;
              })
              .find(Boolean) ??
            typedAccounts[0] ??
            null;

          if (!matchedAccount) {
            result.skipped += 1;
            continue;
          }

          const activityInsert = await supabase
            .from("activities")
            .insert({
              workspace_id: input.workspace.id,
              account_id: matchedAccount.id,
              contact_id: matchedContact?.id ?? null,
              actor_id: input.userId,
              activity_type: "note_added",
              title: `Slack signal synced from #${channel.name}`,
              description: message.text || null,
              occurred_at: message.occurredAt,
              metadata: {
                topic: "slack_message",
                slack_channel_id: channel.id,
                slack_channel_name: channel.name,
                slack_message_ts: message.id,
                slack_user_id: message.userId,
              },
            })
            .select("id")
            .single();

          if (activityInsert.error || !activityInsert.data) {
            throw activityInsert.error ?? new Error("Failed to insert Slack activity.");
          }

          const noteInsert = await supabase
            .from("notes")
            .insert({
              workspace_id: input.workspace.id,
              account_id: matchedAccount.id,
              contact_id: matchedContact?.id ?? null,
              author_id: input.userId,
              title: `Slack signal: #${channel.name}`,
              content: message.text || "(empty Slack message)",
              source_type: "transcript",
              topic: "slack_message",
              importance_level: "medium",
            })
            .select("*")
            .single();

          if (noteInsert.error || !noteInsert.data) {
            throw noteInsert.error ?? new Error("Failed to insert Slack note.");
          }

          const insertedNote = noteInsert.data as Note;

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
              await supabase.from("notes").update({ hydradb_memory_id: memoryId }).eq("id", insertedNote.id);
            }
          } catch (ingestError) {
            console.error("HydraDB Slack note ingestion failed", ingestError);
          }

          const syncInsert = await supabase.from("slack_message_syncs").insert({
            workspace_id: input.workspace.id,
            user_id: input.userId,
            slack_channel_id: channel.id,
            slack_channel_name: channel.name,
            slack_message_ts: message.id,
            account_id: matchedAccount.id,
            contact_id: matchedContact?.id ?? null,
            activity_id: activityInsert.data.id,
            note_id: insertedNote.id,
          });

          if (syncInsert.error) throw syncInsert.error;

          existingKeys.add(syncKey);
          result.imported += 1;
        } catch (messageError) {
          console.error("Slack message sync failed", messageError);
          result.failed += 1;
        }
      }
    }

    await updateSlackSyncState({
      workspaceId: input.workspace.id,
      userId: input.userId,
      syncStatus: "ok",
      lastSyncedAt: new Date().toISOString(),
      lastError: null,
    });

    logIntegrationEvent({
      source: "slack",
      event: "slack_sync_completed",
      workspaceId: input.workspace.id,
      userId: input.userId,
      detail: {
        token_mode: usingBotFallback ? "bot_fallback" : "user_token",
        scanned: result.scanned,
        imported: result.imported,
        skipped: result.skipped,
        failed: result.failed,
      },
    });

    return result;
  } catch (error) {
    await updateSlackSyncState({
      workspaceId: input.workspace.id,
      userId: input.userId,
      syncStatus: "error",
      lastError: error instanceof Error ? error.message : "Slack sync failed.",
    });

    throw error;
  }
}
