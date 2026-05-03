import { ContextRail } from "@/components/contextiq/context-rail";
import { ActionsSurface } from "@/components/contextiq/v2-surfaces";
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

export default async function ActionsRoute() {
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
      activeView="actions"
      headerLabel="Actions"
      accounts={accounts}
      profileName={profile.full_name || profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
      outlookStatus={outlookStatus}
      slackStatus={slackStatus}
      rail={<ContextRail memories={railMemories} />}
    >
      <ActionsSurface workspaceId={workspace.id} readiness={readiness} />
    </WorkspaceShell>
  );
}
