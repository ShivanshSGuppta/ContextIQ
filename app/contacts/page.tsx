import { ContextRail } from "@/components/contextiq/context-rail";
import { ContactsPage } from "@/components/contextiq/contacts-page";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import {
  getWorkspaceAccounts,
  getWorkspaceContacts,
  getWorkspaceContext,
  getWorkspaceGmailStatus,
  getWorkspaceLinkedInStatus,
  getWorkspaceRailMemories,
} from "@/lib/data/contextiq";

export default async function ContactsRoute() {
  const [
    { workspace, profile },
    accounts,
    contacts,
    railMemories,
    gmailStatus,
    linkedInStatus,
  ] = await Promise.all([
    getWorkspaceContext(),
    getWorkspaceAccounts(),
    getWorkspaceContacts(),
    getWorkspaceRailMemories(),
    getWorkspaceGmailStatus(),
    getWorkspaceLinkedInStatus(),
  ]);

  return (
    <WorkspaceShell
      activeView="contacts"
      headerLabel="Contacts"
      accounts={accounts}
      profileName={profile.full_name || profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
      rail={<ContextRail memories={railMemories} />}
    >
      <ContactsPage workspaceId={workspace.id} accounts={accounts} contacts={contacts} />
    </WorkspaceShell>
  );
}
