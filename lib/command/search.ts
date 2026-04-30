import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { CommandSearchHit, CommandSearchRequest, CommandSearchResponse } from "@/types";

export async function runCommandSearch(input: CommandSearchRequest): Promise<CommandSearchResponse> {
  const supabase = await getSupabaseServerClient();
  const limit = Math.max(1, Math.min(input.limit ?? 12, 50));

  const hitsFromIndex = await (async () => {
    try {
      const { data } = await supabase
        .from("search_index_entries")
        .select("id,entity_type,entity_id,title,body,normalized_payload,synced_at")
        .eq("workspace_id", input.workspaceId)
        .ilike("body", `%${input.query}%`)
        .order("synced_at", { ascending: false })
        .limit(limit);

      return ((data ?? []) as Array<Record<string, unknown>>).map((row) => ({
        id: row.id as string,
        type: row.entity_type as CommandSearchHit["type"],
        title: (row.title as string | null) ?? "Context entry",
        snippet: String(row.body ?? "").slice(0, 240),
        provider: ((row.normalized_payload as Record<string, unknown> | null)?.provider ??
          null) as CommandSearchHit["provider"],
        occurredAt: (row.synced_at as string | null) ?? null,
        relevance: 0.8,
        ref: {
          entity_type: row.entity_type as CommandSearchHit["type"],
          entity_id: String(row.entity_id),
          provider: ((row.normalized_payload as Record<string, unknown> | null)?.provider ??
            null) as CommandSearchHit["provider"],
        },
      }));
    } catch {
      return [] as CommandSearchHit[];
    }
  })();

  if (hitsFromIndex.length > 0) {
    return {
      query: input.query,
      hits: hitsFromIndex,
    };
  }

  const [notesResult, activityResult] = await Promise.all([
    supabase
      .from("notes")
      .select("id,title,content,account_id,created_at,source_type")
      .eq("workspace_id", input.workspaceId)
      .ilike("content", `%${input.query}%`)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("activities")
      .select("id,title,description,account_id,occurred_at,activity_type")
      .eq("workspace_id", input.workspaceId)
      .or(`title.ilike.%${input.query}%,description.ilike.%${input.query}%`)
      .order("occurred_at", { ascending: false })
      .limit(limit),
  ]);

  const noteHits: CommandSearchHit[] = (
    (notesResult.data ?? []) as Array<Record<string, unknown>>
  ).map((row) => ({
    id: `note-${row.id}`,
    type: "note",
    title: (row.title as string | null) || "Account note",
    snippet: String(row.content ?? "").slice(0, 240),
    provider: null,
    occurredAt: row.created_at as string,
    relevance: 0.65,
    ref: {
      entity_type: "note",
      entity_id: String(row.id),
      provider: null,
    },
  }));

  const activityHits: CommandSearchHit[] = (
    (activityResult.data ?? []) as Array<Record<string, unknown>>
  ).map((row) => ({
    id: `activity-${row.id}`,
    type: "activity",
    title: String(row.title ?? "Activity"),
    snippet: String(row.description ?? row.title ?? "").slice(0, 240),
    provider: null,
    occurredAt: row.occurred_at as string,
    relevance: 0.6,
    ref: {
      entity_type: "activity",
      entity_id: String(row.id),
      provider: null,
    },
  }));

  return {
    query: input.query,
    hits: [...noteHits, ...activityHits].slice(0, limit),
  };
}
