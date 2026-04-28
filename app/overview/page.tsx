import { ContextRail } from "@/components/contextiq/context-rail";
import { OverviewPage } from "@/components/contextiq/overview-page";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import {
  getWorkspaceAccounts,
  getWorkspaceGmailStatus,
  getWorkspaceLinkedInStatus,
  getWorkspaceOverviewData,
  getWorkspaceRailMemories,
} from "@/lib/data/contextiq";

export default async function OverviewRoute() {
  const [overviewData, accounts, railMemories, gmailStatus, linkedInStatus] = await Promise.all([
    getWorkspaceOverviewData(),
    getWorkspaceAccounts(),
    getWorkspaceRailMemories(),
    getWorkspaceGmailStatus(),
    getWorkspaceLinkedInStatus(),
  ]);

  return (
    <WorkspaceShell
      activeView="overview"
      headerLabel="Overview"
      accounts={accounts}
      profileName={overviewData.profile.full_name || overviewData.profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
      rail={<ContextRail memories={railMemories} />}
    >
      <OverviewPage data={overviewData} />
    </WorkspaceShell>
  );
}
