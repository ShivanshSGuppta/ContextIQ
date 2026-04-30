import { INTEGRATION_DEFAULT_CAPABILITIES, INTEGRATION_PROVIDERS } from "@/lib/integrations/catalog";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type {
  IntegrationCapability,
  IntegrationConnectionStatus,
  IntegrationProvider,
  ProviderReadinessStatus,
} from "@/types";

type ConnectionRow = {
  provider: IntegrationProvider;
  status: IntegrationConnectionStatus;
  capabilities: IntegrationCapability[] | null;
  synced_at: string | null;
};

export async function getWorkspaceProviderReadiness(params: {
  workspaceId: string;
}) {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from("integration_connections")
    .select("provider,status,capabilities,synced_at")
    .eq("workspace_id", params.workspaceId);

  const byProvider = new Map<IntegrationProvider, ConnectionRow>();
  for (const row of (data ?? []) as ConnectionRow[]) {
    byProvider.set(row.provider, row);
  }

  return INTEGRATION_PROVIDERS.map((provider): ProviderReadinessStatus => {
    const found = byProvider.get(provider);
    if (!found) {
      return {
        provider,
        status: "pending_approval",
        capabilities: INTEGRATION_DEFAULT_CAPABILITIES[provider],
        last_synced_at: null,
        message: "Not connected. Pending provider approval or setup.",
      };
    }

    return {
      provider,
      status: found.status,
      capabilities:
        found.capabilities && found.capabilities.length > 0
          ? found.capabilities
          : INTEGRATION_DEFAULT_CAPABILITIES[provider],
      last_synced_at: found.synced_at,
      message:
        found.status === "connected"
          ? "Connected"
          : found.status === "error"
            ? "Connection error"
            : found.status === "disconnected"
              ? "Disconnected"
              : "Pending provider approval",
    };
  });
}
