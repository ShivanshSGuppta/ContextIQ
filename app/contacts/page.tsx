import { ContextRail } from "@/components/contextiq/context-rail";
import { ContactsPage } from "@/components/contextiq/contacts-page";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import {
  getWorkspaceAccounts,
  getWorkspaceContacts,
  getWorkspaceContext,
  getWorkspaceGmailStatus,
  getWorkspaceLinkedInStatus,
  getWorkspaceOutlookStatus,
  getWorkspaceRailMemories,
  getWorkspaceSlackStatus,
} from "@/lib/data/contextiq";

export default async function ContactsRoute() {
  const [
    { workspace, profile },
    accounts,
    contacts,
    railMemories,
    gmailStatus,
    linkedInStatus,
    outlookStatus,
    slackStatus,
  ] = await Promise.all([
    getWorkspaceContext(),
    getWorkspaceAccounts(),
    getWorkspaceContacts(),
    getWorkspaceRailMemories(),
    getWorkspaceGmailStatus(),
    getWorkspaceLinkedInStatus(),
    getWorkspaceOutlookStatus(),
    getWorkspaceSlackStatus(),
  ]);

  return (
    <WorkspaceShell
      activeView="contacts"
      headerLabel="Contacts"
      accounts={accounts}
      profileName={profile.full_name || profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
      outlookStatus={outlookStatus}
      slackStatus={slackStatus}
      rail={<ContextRail memories={railMemories} />}
    >
      <ContactsPage workspaceId={workspace.id} accounts={accounts} contacts={contacts} />
    </WorkspaceShell>
  );
}
