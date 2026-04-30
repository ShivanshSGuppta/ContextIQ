import { ContextRail } from "@/components/contextiq/context-rail";
import { PeopleSurface } from "@/components/contextiq/v2-surfaces";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import {
  getPeopleSurfaceData,
  getWorkspaceAccounts,
  getWorkspaceContext,
  getWorkspaceGmailStatus,
  getWorkspaceLinkedInStatus,
  getWorkspaceRailMemories,
} from "@/lib/data/contextiq";

export default async function PeopleRoute() {
  const [{ profile }, accounts, railMemories, peopleData, gmailStatus, linkedInStatus] =
    await Promise.all([
      getWorkspaceContext(),
      getWorkspaceAccounts(),
      getWorkspaceRailMemories(),
      getPeopleSurfaceData(),
      getWorkspaceGmailStatus(),
      getWorkspaceLinkedInStatus(),
    ]);

  return (
    <WorkspaceShell
      activeView="people"
      headerLabel="People"
      accounts={accounts}
      profileName={profile.full_name || profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
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
