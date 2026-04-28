import { notFound } from "next/navigation";

import { WalkInAccountPage } from "@/components/contextiq/walk-in-account-page";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import { getWalkInAccountPageData, getWalkInActionOutput, getWalkInOverviewData } from "@/lib/data/walk-in";

export default async function WalkInAccountRoute({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;
  const overviewData = getWalkInOverviewData();
  const accountData = getWalkInAccountPageData(accountId);

  if (!accountData) {
    notFound();
  }

  return (
    <WorkspaceShell
      activeView="accounts"
      headerLabel={accountData.account.name}
      accounts={overviewData.accounts}
      profileName="Walk-In Experience"
      basePath="/walk-in"
      showSignOut={false}
      activeAccountId={accountId}
    >
      <WalkInAccountPage
        initialData={accountData}
        actionOutputs={{
          prepare_meeting: getWalkInActionOutput(accountId, "prepare_meeting") ?? undefined,
          draft_followup: getWalkInActionOutput(accountId, "draft_followup") ?? undefined,
          summarize_blockers:
            getWalkInActionOutput(accountId, "summarize_blockers") ?? undefined,
          what_changed_recently:
            getWalkInActionOutput(accountId, "what_changed_recently") ?? undefined,
        }}
      />
    </WorkspaceShell>
  );
}
