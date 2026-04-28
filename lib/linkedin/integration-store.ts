import { decryptSecret, encryptSecret } from "@/lib/integrations/token-crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  LinkedInIntegration,
  LinkedInIntegrationStatus,
} from "@/types";

export async function upsertLinkedInIntegrationTokens(input: {
  workspaceId: string;
  userId: string;
  linkedinSub?: string | null;
  email?: string | null;
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: string | null;
  tokenType?: string | null;
  scopes?: string[];
}) {
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase.from("linkedin_integrations").upsert(
    {
      workspace_id: input.workspaceId,
      user_id: input.userId,
      provider: "linkedin",
      linkedin_sub: input.linkedinSub ?? null,
      email: input.email ?? null,
      access_token_encrypted: encryptSecret(input.accessToken),
      refresh_token_encrypted: input.refreshToken ? encryptSecret(input.refreshToken) : null,
      token_type: input.tokenType ?? "Bearer",
      scopes: input.scopes ?? [],
      expires_at: input.expiresAt ?? null,
      connected_at: new Date().toISOString(),
      sync_status: "idle",
      last_error: null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "workspace_id,user_id,provider" },
  );

  if (error) throw error;
}

export async function getDecryptedLinkedInIntegration(input: {
  workspaceId: string;
  userId: string;
}) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("linkedin_integrations")
    .select("*")
    .eq("workspace_id", input.workspaceId)
    .eq("user_id", input.userId)
    .eq("provider", "linkedin")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const integration = data as LinkedInIntegration;
  return {
    ...integration,
    access_token: decryptSecret(integration.access_token_encrypted),
    refresh_token: integration.refresh_token_encrypted
      ? decryptSecret(integration.refresh_token_encrypted)
      : null,
  };
}

export async function getLinkedInIntegrationStatus(input: {
  workspaceId: string;
  userId: string;
}): Promise<LinkedInIntegrationStatus> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("linkedin_integrations")
    .select("email,linkedin_sub,last_synced_at,sync_status,last_error")
    .eq("workspace_id", input.workspaceId)
    .eq("user_id", input.userId)
    .eq("provider", "linkedin")
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    return {
      connected: false,
      email: null,
      linkedin_sub: null,
      last_synced_at: null,
      sync_status: "idle",
      last_error: null,
    };
  }

  return {
    connected: true,
    email: (data.email as string | null) ?? null,
    linkedin_sub: (data.linkedin_sub as string | null) ?? null,
    last_synced_at: (data.last_synced_at as string | null) ?? null,
    sync_status: (data.sync_status as "idle" | "syncing" | "ok" | "error") ?? "idle",
    last_error: (data.last_error as string | null) ?? null,
  };
}

export async function updateLinkedInSyncState(input: {
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
    .from("linkedin_integrations")
    .update(payload)
    .eq("workspace_id", input.workspaceId)
    .eq("user_id", input.userId)
    .eq("provider", "linkedin");

  if (error) throw error;
}
