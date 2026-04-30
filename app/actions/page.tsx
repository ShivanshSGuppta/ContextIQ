import { ContextRail } from "@/components/contextiq/context-rail";
import { ActionsSurface } from "@/components/contextiq/v2-surfaces";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import {
  getProviderReadinessData,
  getWorkspaceAccounts,
  getWorkspaceContext,
  getWorkspaceGmailStatus,
  getWorkspaceLinkedInStatus,
  getWorkspaceRailMemories,
} from "@/lib/data/contextiq";

export default async function ActionsRoute() {
  const [
    { workspace, profile },
    accounts,
    railMemories,
    readiness,
    gmailStatus,
    linkedInStatus,
  ] = await Promise.all([
    getWorkspaceContext(),
    getWorkspaceAccounts(),
    getWorkspaceRailMemories(),
    getProviderReadinessData(),
    getWorkspaceGmailStatus(),
    getWorkspaceLinkedInStatus(),
  ]);

  return (
    <WorkspaceShell
      activeView="actions"
      headerLabel="Actions"
      accounts={accounts}
      profileName={profile.full_name || profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
      rail={<ContextRail memories={railMemories} />}
    >
      <ActionsSurface workspaceId={workspace.id} readiness={readiness} />
    </WorkspaceShell>
  );
}
