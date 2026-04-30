import { ContextRail } from "@/components/contextiq/context-rail";
import { ActivityAuditSurface } from "@/components/contextiq/v2-surfaces";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import {
  getActionsAuditSurfaceData,
  getWorkspaceAccounts,
  getWorkspaceContext,
  getWorkspaceGmailStatus,
  getWorkspaceLinkedInStatus,
  getWorkspaceRailMemories,
} from "@/lib/data/contextiq";

export default async function ActivityAuditRoute() {
  const [{ profile }, accounts, railMemories, auditData, gmailStatus, linkedInStatus] =
    await Promise.all([
      getWorkspaceContext(),
      getWorkspaceAccounts(),
      getWorkspaceRailMemories(),
      getActionsAuditSurfaceData(),
      getWorkspaceGmailStatus(),
      getWorkspaceLinkedInStatus(),
    ]);

  return (
    <WorkspaceShell
      activeView="activity_audit"
      headerLabel="Activity / Audit"
      accounts={accounts}
      profileName={profile.full_name || profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
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
