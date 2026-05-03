import { ContextRail } from "@/components/contextiq/context-rail";
import { MeetingsSurface } from "@/components/contextiq/v2-surfaces";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import {
  getMeetingsSurfaceData,
  getWorkspaceAccounts,
  getWorkspaceContext,
  getWorkspaceGmailStatus,
  getWorkspaceLinkedInStatus,
  getWorkspaceOutlookStatus,
  getWorkspaceRailMemories,
  getWorkspaceSlackStatus,
} from "@/lib/data/contextiq";

export default async function MeetingsRoute() {
  const [{ profile }, accounts, railMemories, meetingsData, gmailStatus, linkedInStatus, outlookStatus, slackStatus] =
    await Promise.all([
      getWorkspaceContext(),
      getWorkspaceAccounts(),
      getWorkspaceRailMemories(),
      getMeetingsSurfaceData(),
      getWorkspaceGmailStatus(),
      getWorkspaceLinkedInStatus(),
      getWorkspaceOutlookStatus(),
      getWorkspaceSlackStatus(),
    ]);

  return (
    <WorkspaceShell
      activeView="meetings"
      headerLabel="Meetings"
      accounts={accounts}
      profileName={profile.full_name || profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
      outlookStatus={outlookStatus}
      slackStatus={slackStatus}
      rail={<ContextRail memories={railMemories} />}
    >
      <MeetingsSurface
        meetings={meetingsData.meetings}
        legacyMeetings={meetingsData.legacyMeetingActivities}
      />
    </WorkspaceShell>
  );
}
