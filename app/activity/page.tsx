import { ContextRail } from "@/components/contextiq/context-rail";
import { ActivityPage } from "@/components/contextiq/activity-page";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import {
  getWorkspaceAccounts,
  getWorkspaceActivity,
  getWorkspaceContext,
  getWorkspaceGmailStatus,
  getWorkspaceLinkedInStatus,
  getWorkspaceOutlookStatus,
  getWorkspaceRailMemories,
  getWorkspaceSlackStatus,
} from "@/lib/data/contextiq";

export default async function ActivityRoute() {
  const [
    { profile },
    accounts,
    activities,
    railMemories,
    gmailStatus,
    linkedInStatus,
    outlookStatus,
    slackStatus,
  ] = await Promise.all([
    getWorkspaceContext(),
    getWorkspaceAccounts(),
    getWorkspaceActivity(),
    getWorkspaceRailMemories(),
    getWorkspaceGmailStatus(),
    getWorkspaceLinkedInStatus(),
    getWorkspaceOutlookStatus(),
    getWorkspaceSlackStatus(),
  ]);

  return (
    <WorkspaceShell
      activeView="activity"
      headerLabel="Activity"
      accounts={accounts}
      profileName={profile.full_name || profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
      outlookStatus={outlookStatus}
      slackStatus={slackStatus}
      rail={<ContextRail memories={railMemories} />}
    >
      <ActivityPage activities={activities} accounts={accounts} />
    </WorkspaceShell>
  );
}
