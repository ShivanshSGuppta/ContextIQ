import { ContextRail } from "@/components/contextiq/context-rail";
import { ContactsPage } from "@/components/contextiq/contacts-page";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import { getWalkInOverviewData, getWalkInRailMemories } from "@/lib/data/walk-in";

export default function WalkInContactsRoute() {
  const overviewData = getWalkInOverviewData();
  const railMemories = getWalkInRailMemories();

  return (
    <WorkspaceShell
      activeView="contacts"
      headerLabel="Contacts"
      accounts={overviewData.accounts}
      profileName="Walk-In Experience"
      basePath="/walk-in"
      showSignOut={false}
      rail={<ContextRail memories={railMemories} />}
    >
      <ContactsPage
        workspaceId={overviewData.workspace.id}
        accounts={overviewData.accounts}
        contacts={overviewData.contacts}
        basePath="/walk-in"
        showCreate={false}
      />
    </WorkspaceShell>
  );
}
