import { ContextRail } from "@/components/contextiq/context-rail";
import { ConversationsSurface } from "@/components/contextiq/v2-surfaces";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import {
  getConversationsSurfaceData,
  getWorkspaceAccounts,
  getWorkspaceContext,
  getWorkspaceGmailStatus,
  getWorkspaceLinkedInStatus,
  getWorkspaceOutlookStatus,
  getWorkspaceRailMemories,
  getWorkspaceSlackStatus,
} from "@/lib/data/contextiq";

export default async function ConversationsRoute() {
  const [
    { profile },
    accounts,
    railMemories,
    conversationsData,
    gmailStatus,
    linkedInStatus,
    outlookStatus,
    slackStatus,
  ] = await Promise.all([
    getWorkspaceContext(),
    getWorkspaceAccounts(),
    getWorkspaceRailMemories(),
    getConversationsSurfaceData(),
    getWorkspaceGmailStatus(),
    getWorkspaceLinkedInStatus(),
    getWorkspaceOutlookStatus(),
    getWorkspaceSlackStatus(),
  ]);

  return (
    <WorkspaceShell
      activeView="conversations"
      headerLabel="Conversations"
      accounts={accounts}
      profileName={profile.full_name || profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
      outlookStatus={outlookStatus}
      slackStatus={slackStatus}
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
