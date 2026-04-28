import { slugify } from "@/lib/utils";
import { ensureHydraTenant } from "@/lib/hydradb/client";
import { seedDemoWorkspace } from "@/lib/data/demo-seed";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Workspace } from "@/types";

export async function bootstrapUserWorkspace(params: {
  userId: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
}): Promise<Workspace> {
  const supabase = getSupabaseAdminClient();

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: params.userId,
    email: params.email,
    full_name: params.fullName,
    avatar_url: params.avatarUrl,
    updated_at: new Date().toISOString(),
  });

  if (profileError) throw profileError;

  const { data: existingMembership } = await supabase
    .from("workspace_members")
    .select("workspace:workspaces(*)")
    .eq("user_id", params.userId)
    .limit(1)
    .maybeSingle();

  if (existingMembership?.workspace) {
    return existingMembership.workspace as Workspace;
  }

  const workspaceName = "ContextIQ Demo";
  const workspaceId = crypto.randomUUID();
  const hydraTenantId = `workspace_${workspaceId}`;

  await ensureHydraTenant({
    tenantId: hydraTenantId,
    tenantName: workspaceName,
    tenantDescription: `HydraDB tenant for ${params.email ?? params.userId}`,
  });

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .insert({
      id: workspaceId,
      owner_id: params.userId,
      name: workspaceName,
      slug: slugify(`${workspaceName}-${workspaceId.slice(0, 6)}`),
      description: "Seeded ContextIQ demo workspace",
      hydradb_tenant_id: hydraTenantId,
    })
    .select("*")
    .single();

  if (workspaceError) throw workspaceError;

  const { error: memberError } = await supabase.from("workspace_members").insert({
    workspace_id: workspaceId,
    user_id: params.userId,
    role: "owner",
  });

  if (memberError) throw memberError;

  await seedDemoWorkspace({
    workspaceId,
    userId: params.userId,
    hydraTenantId: hydraTenantId,
  });

  return workspace as Workspace;
}
