import { decryptSecret, encryptSecret } from "@/lib/integrations/token-crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { SlackIntegration, SlackIntegrationStatus } from "@/types";

export async function upsertSlackIntegrationTokens(input: {
  workspaceId: string;
  userId: string;
  email?: string | null;
  teamId?: string | null;
  teamName?: string | null;
  accessToken: string;
  tokenType?: string | null;
  scopes?: string[];
}) {
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase.from("slack_integrations").upsert(
    {
      workspace_id: input.workspaceId,
      user_id: input.userId,
      provider: "slack",
      email: input.email ?? null,
      team_id: input.teamId ?? null,
      team_name: input.teamName ?? null,
      access_token_encrypted: encryptSecret(input.accessToken),
      token_type: input.tokenType ?? "bot",
      scopes: input.scopes ?? [],
      connected_at: new Date().toISOString(),
      sync_status: "idle",
      last_error: null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "workspace_id,user_id,provider" },
  );

  if (error) throw error;
}

export async function getDecryptedSlackIntegration(input: {
  workspaceId: string;
  userId: string;
}) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("slack_integrations")
    .select("*")
    .eq("workspace_id", input.workspaceId)
    .eq("user_id", input.userId)
    .eq("provider", "slack")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const integration = data as SlackIntegration;
  return {
    ...integration,
    access_token: decryptSecret(integration.access_token_encrypted),
  };
}

export async function getSlackIntegrationStatus(input: {
  workspaceId: string;
  userId: string;
}): Promise<SlackIntegrationStatus> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("slack_integrations")
    .select("email,team_id,team_name,last_synced_at,sync_status,last_error")
    .eq("workspace_id", input.workspaceId)
    .eq("user_id", input.userId)
    .eq("provider", "slack")
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    return {
      connected: false,
      email: null,
      team_id: null,
      team_name: null,
      last_synced_at: null,
      sync_status: "idle",
      last_error: null,
    };
  }

  return {
    connected: true,
    email: (data.email as string | null) ?? null,
    team_id: (data.team_id as string | null) ?? null,
    team_name: (data.team_name as string | null) ?? null,
    last_synced_at: (data.last_synced_at as string | null) ?? null,
    sync_status: (data.sync_status as "idle" | "syncing" | "ok" | "error") ?? "idle",
    last_error: (data.last_error as string | null) ?? null,
  };
}

export async function updateSlackSyncState(input: {
  workspaceId: string;
  userId: string;
  syncStatus: "idle" | "syncing" | "ok" | "error";
  lastError?: string | null;
  lastSyncedAt?: string | null;
}) {
  const supabase = getSupabaseAdminClient();
  const payload: Record<string, unknown> = {
    sync_status: input.syncStatus,
    updated_at: new Date().toISOString(),
  };

  if (typeof input.lastError !== "undefined") {
    payload.last_error = input.lastError;
  }

  if (typeof input.lastSyncedAt !== "undefined") {
    payload.last_synced_at = input.lastSyncedAt;
  }

  const { error } = await supabase
    .from("slack_integrations")
    .update(payload)
    .eq("workspace_id", input.workspaceId)
    .eq("user_id", input.userId)
    .eq("provider", "slack");

  if (error) throw error;
}
