import { ContextRail } from "@/components/contextiq/context-rail";
import { ActivityPage } from "@/components/contextiq/activity-page";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import {
  getWorkspaceAccounts,
  getWorkspaceActivity,
  getWorkspaceContext,
  getWorkspaceGmailStatus,
  getWorkspaceLinkedInStatus,
  getWorkspaceRailMemories,
} from "@/lib/data/contextiq";

export default async function ActivityRoute() {
  const [{ profile }, accounts, activities, railMemories, gmailStatus, linkedInStatus] = await Promise.all([
    getWorkspaceContext(),
    getWorkspaceAccounts(),
    getWorkspaceActivity(),
    getWorkspaceRailMemories(),
    getWorkspaceGmailStatus(),
    getWorkspaceLinkedInStatus(),
  ]);

  return (
    <WorkspaceShell
      activeView="activity"
      headerLabel="Activity"
      accounts={accounts}
      profileName={profile.full_name || profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
      rail={<ContextRail memories={railMemories} />}
    >
      <ActivityPage activities={activities} accounts={accounts} />
    </WorkspaceShell>
  );
}
