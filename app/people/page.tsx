import { ContextRail } from "@/components/contextiq/context-rail";
import { PeopleSurface } from "@/components/contextiq/v2-surfaces";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import {
  getPeopleSurfaceData,
  getWorkspaceAccounts,
  getWorkspaceContext,
  getWorkspaceGmailStatus,
  getWorkspaceLinkedInStatus,
  getWorkspaceOutlookStatus,
  getWorkspaceRailMemories,
  getWorkspaceSlackStatus,
} from "@/lib/data/contextiq";

export default async function PeopleRoute() {
  const [{ profile }, accounts, railMemories, peopleData, gmailStatus, linkedInStatus, outlookStatus, slackStatus] =
    await Promise.all([
      getWorkspaceContext(),
      getWorkspaceAccounts(),
      getWorkspaceRailMemories(),
      getPeopleSurfaceData(),
      getWorkspaceGmailStatus(),
      getWorkspaceLinkedInStatus(),
      getWorkspaceOutlookStatus(),
      getWorkspaceSlackStatus(),
    ]);

  return (
    <WorkspaceShell
      activeView="people"
      headerLabel="People"
      accounts={accounts}
      profileName={profile.full_name || profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
      outlookStatus={outlookStatus}
      slackStatus={slackStatus}
      rail={<ContextRail memories={railMemories} />}
    >
      <PeopleSurface
        contacts={peopleData.contacts}
        people={peopleData.people}
        aliases={peopleData.aliases}
      />
    </WorkspaceShell>
  );
}
