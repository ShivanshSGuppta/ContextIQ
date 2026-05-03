import { ContextRail } from "@/components/contextiq/context-rail";
import { ActivityAuditSurface } from "@/components/contextiq/v2-surfaces";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import {
  getActionsAuditSurfaceData,
  getWorkspaceAccounts,
  getWorkspaceContext,
  getWorkspaceGmailStatus,
  getWorkspaceLinkedInStatus,
  getWorkspaceOutlookStatus,
  getWorkspaceRailMemories,
  getWorkspaceSlackStatus,
} from "@/lib/data/contextiq";

export default async function ActivityAuditRoute() {
  const [{ profile }, accounts, railMemories, auditData, gmailStatus, linkedInStatus, outlookStatus, slackStatus] =
    await Promise.all([
      getWorkspaceContext(),
      getWorkspaceAccounts(),
      getWorkspaceRailMemories(),
      getActionsAuditSurfaceData(),
      getWorkspaceGmailStatus(),
      getWorkspaceLinkedInStatus(),
      getWorkspaceOutlookStatus(),
      getWorkspaceSlackStatus(),
    ]);

  return (
    <WorkspaceShell
      activeView="activity_audit"
      headerLabel="Activity / Audit"
      accounts={accounts}
      profileName={profile.full_name || profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
      outlookStatus={outlookStatus}
      slackStatus={slackStatus}
      rail={<ContextRail memories={railMemories} />}
    >
      <ActivityAuditSurface
        timelineEvents={auditData.timelineEvents}
        actionExecutions={auditData.actionExecutions}
        syncRuns={auditData.syncRuns}
      />
    </WorkspaceShell>
  );
}
