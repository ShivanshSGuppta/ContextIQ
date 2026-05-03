import { ContextRail } from "@/components/contextiq/context-rail";
import { OverviewPage } from "@/components/contextiq/overview-page";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import {
  getWorkspaceAccounts,
  getWorkspaceGmailStatus,
  getWorkspaceLinkedInStatus,
  getWorkspaceOutlookStatus,
  getWorkspaceOverviewData,
  getWorkspaceRailMemories,
  getWorkspaceSlackStatus,
} from "@/lib/data/contextiq";

export default async function OverviewRoute() {
  const [overviewData, accounts, railMemories, gmailStatus, linkedInStatus, outlookStatus, slackStatus] = await Promise.all([
    getWorkspaceOverviewData(),
    getWorkspaceAccounts(),
    getWorkspaceRailMemories(),
    getWorkspaceGmailStatus(),
    getWorkspaceLinkedInStatus(),
    getWorkspaceOutlookStatus(),
    getWorkspaceSlackStatus(),
  ]);

  return (
    <WorkspaceShell
      activeView="overview"
      headerLabel="Overview"
      accounts={accounts}
      profileName={overviewData.profile.full_name || overviewData.profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
      outlookStatus={outlookStatus}
      slackStatus={slackStatus}
      rail={<ContextRail memories={railMemories} />}
    >
      <OverviewPage data={overviewData} />
    </WorkspaceShell>
  );
}
