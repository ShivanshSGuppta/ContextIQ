import { ContextRail } from "@/components/contextiq/context-rail";
import { ActivityPage } from "@/components/contextiq/activity-page";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import { getWalkInOverviewData, getWalkInRailMemories } from "@/lib/data/walk-in";

export default function WalkInActivityRoute() {
  const overviewData = getWalkInOverviewData();
  const railMemories = getWalkInRailMemories();

  return (
    <WorkspaceShell
      activeView="activity"
      headerLabel="Activity"
      accounts={overviewData.accounts}
      profileName="Walk-In Experience"
      basePath="/walk-in"
      showSignOut={false}
      rail={<ContextRail memories={railMemories} />}
    >
      <ActivityPage
        activities={overviewData.recent_activities}
        accounts={overviewData.accounts}
        basePath="/walk-in"
      />
    </WorkspaceShell>
  );
}
