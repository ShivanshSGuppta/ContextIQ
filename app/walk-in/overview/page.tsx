import { ContextRail } from "@/components/contextiq/context-rail";
import { OverviewPage } from "@/components/contextiq/overview-page";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import { getWalkInOverviewData, getWalkInRailMemories } from "@/lib/data/walk-in";

export default function WalkInOverviewRoute() {
  const overviewData = getWalkInOverviewData();
  const railMemories = getWalkInRailMemories();

  return (
    <WorkspaceShell
      activeView="overview"
      headerLabel="Overview"
      accounts={overviewData.accounts}
      profileName="Walk-In Experience"
      basePath="/walk-in"
      showSignOut={false}
      rail={<ContextRail memories={railMemories} />}
    >
      <OverviewPage data={overviewData} basePath="/walk-in" showCreate={false} />
    </WorkspaceShell>
  );
}
