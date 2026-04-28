import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function assertIntegrationRateLimit(input: {
  workspaceId: string;
  userId: string;
  actionKey: string;
  limit: number;
  windowMinutes: number;
}) {
  const supabase = getSupabaseAdminClient();
  const since = new Date(Date.now() - input.windowMinutes * 60_000).toISOString();

  const { count, error } = await supabase
    .from("integration_action_events")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", input.workspaceId)
    .eq("user_id", input.userId)
    .eq("action_key", input.actionKey)
    .gte("created_at", since);

  if (error) throw error;
  if ((count ?? 0) >= input.limit) {
    throw new Error(
      `Rate limit exceeded for ${input.actionKey}. Try again in ${input.windowMinutes} minutes.`,
    );
  }
}

export async function recordIntegrationActionEvent(input: {
  workspaceId: string;
  userId: string;
  actionKey: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("integration_action_events").insert({
    workspace_id: input.workspaceId,
    user_id: input.userId,
    action_key: input.actionKey,
    metadata: input.metadata ?? {},
  });

  if (error) throw error;
}
