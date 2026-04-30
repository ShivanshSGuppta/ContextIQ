import { ContextRail } from "@/components/contextiq/context-rail";
import { ConversationsSurface } from "@/components/contextiq/v2-surfaces";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import {
  getConversationsSurfaceData,
  getWorkspaceAccounts,
  getWorkspaceContext,
  getWorkspaceGmailStatus,
  getWorkspaceLinkedInStatus,
  getWorkspaceRailMemories,
} from "@/lib/data/contextiq";

export default async function ConversationsRoute() {
  const [
    { profile },
    accounts,
    railMemories,
    conversationsData,
    gmailStatus,
    linkedInStatus,
  ] = await Promise.all([
    getWorkspaceContext(),
    getWorkspaceAccounts(),
    getWorkspaceRailMemories(),
    getConversationsSurfaceData(),
    getWorkspaceGmailStatus(),
    getWorkspaceLinkedInStatus(),
  ]);

  return (
    <WorkspaceShell
      activeView="conversations"
      headerLabel="Conversations"
      accounts={accounts}
      profileName={profile.full_name || profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
      rail={<ContextRail memories={railMemories} />}
    >
      <ConversationsSurface
        conversations={conversationsData.conversations}
        messages={conversationsData.messages}
        legacyActivities={conversationsData.legacyEmailActivities}
      />
    </WorkspaceShell>
  );
}
