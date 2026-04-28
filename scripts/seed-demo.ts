import "dotenv/config";

import { ensureHydraTenant } from "@/lib/hydradb/client";
import { seedDemoWorkspace } from "@/lib/data/demo-seed";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

async function main() {
  const supabase = getSupabaseAdminClient();
  const seedEmail = process.env.SEED_USER_EMAIL ?? null;

  const profileQuery = supabase.from("profiles").select("*").limit(1);
  const { data: profile } = seedEmail
    ? await supabase.from("profiles").select("*").eq("email", seedEmail).single()
    : await profileQuery.single();

  if (!profile) {
    throw new Error(
      "No profile found. Sign in once first, or set SEED_USER_EMAIL to an existing profile email.",
    );
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace:workspaces(*)")
    .eq("user_id", profile.id)
    .limit(1)
    .maybeSingle();

  const existingWorkspace = membership?.workspace as
    | { id: string; hydradb_tenant_id: string; name: string }
    | undefined;

  let workspaceId = existingWorkspace?.id;
  let hydraTenantId = existingWorkspace?.hydradb_tenant_id;

  if (!workspaceId || !hydraTenantId) {
    workspaceId = crypto.randomUUID();
    hydraTenantId = `workspace_${workspaceId}`;
    await ensureHydraTenant({
      tenantId: hydraTenantId,
      tenantName: "ContextIQ Demo",
      tenantDescription: "Seeded ContextIQ demo workspace",
    });

    await supabase.from("workspaces").insert({
      id: workspaceId,
      owner_id: profile.id,
      name: "ContextIQ Demo",
      slug: slugify(`contextiq-demo-${workspaceId.slice(0, 6)}`),
      description: "Seeded ContextIQ demo workspace",
      hydradb_tenant_id: hydraTenantId,
    });

    await supabase.from("workspace_members").insert({
      workspace_id: workspaceId,
      user_id: profile.id,
      role: "owner",
    });
  }

  await seedDemoWorkspace({
    workspaceId,
    userId: profile.id,
    hydraTenantId,
  });

  console.log(`Seeded ContextIQ demo workspace for ${profile.email ?? profile.id}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
