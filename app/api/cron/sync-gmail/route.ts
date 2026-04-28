import { NextRequest, NextResponse } from "next/server";

import { assertAuthorizedCronRequest } from "@/lib/cron/auth";
import { syncWorkspaceGmailMessages } from "@/lib/gmail/sync";
import { logIntegrationEvent } from "@/lib/integrations/telemetry";
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
  const { data, error } = await supabase
    .from("gmail_integrations")
    .select("workspace_id,user_id,workspaces:workspace_id(id,hydradb_tenant_id)")
    .eq("provider", "google");

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  let processed = 0;
  let failed = 0;
  const details: Array<Record<string, unknown>> = [];

  for (const row of data ?? []) {
    const workspace = row.workspaces as { id: string; hydradb_tenant_id: string } | null;
    if (!workspace?.id || !workspace.hydradb_tenant_id) {
      failed += 1;
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
      processed += 1;
      details.push({
        workspace_id: workspace.id,
        user_id: row.user_id,
        ...result,
      });
    } catch (syncError) {
      failed += 1;
      details.push({
        workspace_id: workspace.id,
        user_id: row.user_id,
        error: syncError instanceof Error ? syncError.message : "sync failed",
      });
    }
  }

  logIntegrationEvent({
    source: "cron",
    event: "gmail_cron_completed",
    detail: {
      processed,
      failed,
      total: (data ?? []).length,
    },
  });

  return NextResponse.json({
    ok: true,
    processed,
    failed,
    total: (data ?? []).length,
    details,
  });
}
