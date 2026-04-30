import { ContextRail } from "@/components/contextiq/context-rail";
import { MeetingsSurface } from "@/components/contextiq/v2-surfaces";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import {
  getMeetingsSurfaceData,
  getWorkspaceAccounts,
  getWorkspaceContext,
  getWorkspaceGmailStatus,
  getWorkspaceLinkedInStatus,
  getWorkspaceRailMemories,
} from "@/lib/data/contextiq";

export default async function MeetingsRoute() {
  const [{ profile }, accounts, railMemories, meetingsData, gmailStatus, linkedInStatus] =
    await Promise.all([
      getWorkspaceContext(),
      getWorkspaceAccounts(),
      getWorkspaceRailMemories(),
      getMeetingsSurfaceData(),
      getWorkspaceGmailStatus(),
      getWorkspaceLinkedInStatus(),
    ]);

  return (
    <WorkspaceShell
      activeView="meetings"
      headerLabel="Meetings"
      accounts={accounts}
      profileName={profile.full_name || profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
      rail={<ContextRail memories={railMemories} />}
    >
      <MeetingsSurface
        meetings={meetingsData.meetings}
        legacyMeetings={meetingsData.legacyMeetingActivities}
      />
    </WorkspaceShell>
  );
}
