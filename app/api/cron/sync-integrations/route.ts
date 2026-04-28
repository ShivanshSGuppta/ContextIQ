import { NextRequest, NextResponse } from "next/server";

import { assertAuthorizedCronRequest } from "@/lib/cron/auth";
import { syncWorkspaceGmailMessages } from "@/lib/gmail/sync";
import { logIntegrationEvent } from "@/lib/integrations/telemetry";
import { syncWorkspaceLinkedInSignals } from "@/lib/linkedin/sync";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    assertAuthorizedCronRequest(request);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unauthorized" },
      { status: 401 },
    );
  }

  const supabase = getSupabaseAdminClient();

  const gmailResult = {
    processed: 0,
    failed: 0,
    total: 0,
    details: [] as Array<Record<string, unknown>>,
  };

  const { data: gmailRows, error: gmailError } = await supabase
    .from("gmail_integrations")
    .select("workspace_id,user_id,workspaces:workspace_id(id,hydradb_tenant_id)")
    .eq("provider", "google");

  if (gmailError) {
    return NextResponse.json({ ok: false, error: gmailError.message }, { status: 500 });
  }

  gmailResult.total = (gmailRows ?? []).length;

  for (const row of gmailRows ?? []) {
    const workspace = row.workspaces as { id: string; hydradb_tenant_id: string } | null;
    if (!workspace?.id || !workspace.hydradb_tenant_id) {
      gmailResult.failed += 1;
      continue;
    }

    try {
      const result = await syncWorkspaceGmailMessages({
        userId: row.user_id as string,
        workspace: {
          id: workspace.id,
          owner_id: "",
          name: "",
          slug: null,
          description: null,
          hydradb_tenant_id: workspace.hydradb_tenant_id,
        },
        maxResults: 25,
      });
      gmailResult.processed += 1;
      gmailResult.details.push({
        workspace_id: workspace.id,
        user_id: row.user_id,
        ...result,
      });
    } catch (syncError) {
      gmailResult.failed += 1;
      gmailResult.details.push({
        workspace_id: workspace.id,
        user_id: row.user_id,
        error: syncError instanceof Error ? syncError.message : "sync failed",
      });
    }
  }

  const linkedInResult = {
    processed: 0,
    failed: 0,
    total: 0,
    details: [] as Array<Record<string, unknown>>,
  };

  const { data: linkedInRows, error: linkedInError } = await supabase
    .from("linkedin_integrations")
    .select("workspace_id,user_id,workspaces:workspace_id(id,hydradb_tenant_id)")
    .eq("provider", "linkedin");

  if (linkedInError) {
    return NextResponse.json({ ok: false, error: linkedInError.message }, { status: 500 });
  }

  linkedInResult.total = (linkedInRows ?? []).length;

  for (const row of linkedInRows ?? []) {
    const workspace = row.workspaces as { id: string; hydradb_tenant_id: string } | null;
    if (!workspace?.id || !workspace.hydradb_tenant_id) {
      linkedInResult.failed += 1;
      continue;
    }

    try {
      const result = await syncWorkspaceLinkedInSignals({
        userId: row.user_id as string,
        workspace: {
          id: workspace.id,
          owner_id: "",
          name: "",
          slug: null,
          description: null,
          hydradb_tenant_id: workspace.hydradb_tenant_id,
        },
        maxContacts: 25,
      });
      linkedInResult.processed += 1;
      linkedInResult.details.push({
        workspace_id: workspace.id,
        user_id: row.user_id,
        ...result,
      });
    } catch (syncError) {
      linkedInResult.failed += 1;
      linkedInResult.details.push({
        workspace_id: workspace.id,
        user_id: row.user_id,
        error: syncError instanceof Error ? syncError.message : "sync failed",
      });
    }
  }

  logIntegrationEvent({
    source: "cron",
    event: "integrations_cron_completed",
    detail: {
      gmail: {
        processed: gmailResult.processed,
        failed: gmailResult.failed,
        total: gmailResult.total,
      },
      linkedin: {
        processed: linkedInResult.processed,
        failed: linkedInResult.failed,
        total: linkedInResult.total,
      },
    },
  });

  return NextResponse.json({
    ok: true,
    gmail: gmailResult,
    linkedin: linkedInResult,
  });
}
