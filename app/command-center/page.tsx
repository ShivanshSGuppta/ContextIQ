import { ContextRail } from "@/components/contextiq/context-rail";
import { CommandCenterSurface } from "@/components/contextiq/v2-surfaces";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import {
  getProviderReadinessData,
  getWorkspaceAccounts,
  getWorkspaceContext,
  getWorkspaceGmailStatus,
  getWorkspaceLinkedInStatus,
  getWorkspaceOutlookStatus,
  getWorkspaceRailMemories,
  getWorkspaceSlackStatus,
} from "@/lib/data/contextiq";

export default async function CommandCenterRoute() {
  const [
    { workspace, profile },
    accounts,
    railMemories,
    readiness,
    gmailStatus,
    linkedInStatus,
    outlookStatus,
    slackStatus,
  ] = await Promise.all([
    getWorkspaceContext(),
    getWorkspaceAccounts(),
    getWorkspaceRailMemories(),
    getProviderReadinessData(),
    getWorkspaceGmailStatus(),
    getWorkspaceLinkedInStatus(),
    getWorkspaceOutlookStatus(),
    getWorkspaceSlackStatus(),
  ]);

  return (
    <WorkspaceShell
      activeView="command_center"
      headerLabel="Command Center"
      accounts={accounts}
      profileName={profile.full_name || profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
      outlookStatus={outlookStatus}
      slackStatus={slackStatus}
      rail={<ContextRail memories={railMemories} />}
    >
      <CommandCenterSurface workspaceId={workspace.id} readiness={readiness} />
    </WorkspaceShell>
  );
}
