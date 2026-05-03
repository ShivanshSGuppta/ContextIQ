import { ContextRail } from "@/components/contextiq/context-rail";
import { NotesBriefsSurface } from "@/components/contextiq/v2-surfaces";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import {
  getNotesBriefsSurfaceData,
  getWorkspaceAccounts,
  getWorkspaceContext,
  getWorkspaceGmailStatus,
  getWorkspaceLinkedInStatus,
  getWorkspaceOutlookStatus,
  getWorkspaceRailMemories,
  getWorkspaceSlackStatus,
} from "@/lib/data/contextiq";

export default async function NotesBriefsRoute() {
  const [{ profile }, accounts, railMemories, notesData, gmailStatus, linkedInStatus, outlookStatus, slackStatus] =
    await Promise.all([
      getWorkspaceContext(),
      getWorkspaceAccounts(),
      getWorkspaceRailMemories(),
      getNotesBriefsSurfaceData(),
      getWorkspaceGmailStatus(),
      getWorkspaceLinkedInStatus(),
      getWorkspaceOutlookStatus(),
      getWorkspaceSlackStatus(),
    ]);

  return (
    <WorkspaceShell
      activeView="notes_briefs"
      headerLabel="Notes / Briefs"
      accounts={accounts}
      profileName={profile.full_name || profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
      outlookStatus={outlookStatus}
      slackStatus={slackStatus}
      rail={<ContextRail memories={railMemories} />}
    >
      <NotesBriefsSurface
        notes={notesData.notes}
        documents={notesData.documents}
      />
    </WorkspaceShell>
  );
}
