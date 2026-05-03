export function logIntegrationEvent(input: {
  source: "gmail" | "linkedin" | "outlook" | "slack" | "cron";
  event: string;
  workspaceId?: string;
  userId?: string;
  detail?: Record<string, unknown>;
}) {
  console.info(
    JSON.stringify({
      ts: new Date().toISOString(),
      layer: "integration",
      source: input.source,
      event: input.event,
      workspace_id: input.workspaceId ?? null,
      user_id: input.userId ?? null,
      detail: input.detail ?? {},
    }),
  );
}
