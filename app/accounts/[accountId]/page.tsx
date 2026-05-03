import { notFound } from "next/navigation";

import { AccountPageClient } from "@/components/contextiq/account-page-client";
import { WorkspaceShell } from "@/components/contextiq/workspace-shell";
import {
  getAccountPageData,
  getWorkspaceAccounts,
  getWorkspaceContext,
  getWorkspaceGmailStatus,
  getWorkspaceLinkedInStatus,
  getWorkspaceOutlookStatus,
  getWorkspaceSlackStatus,
} from "@/lib/data/contextiq";

export default async function AccountRoute({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;

  const result = await Promise.all([
    getWorkspaceContext(),
    getWorkspaceAccounts(),
    getAccountPageData(accountId),
    getWorkspaceGmailStatus(),
    getWorkspaceLinkedInStatus(),
    getWorkspaceOutlookStatus(),
    getWorkspaceSlackStatus(),
  ]).catch(() => null);

  if (!result) {
    notFound();
  }

  const [
    { workspace, profile },
    accounts,
    accountData,
    gmailStatus,
    linkedInStatus,
    outlookStatus,
    slackStatus,
  ] = result;

  return (
    <WorkspaceShell
      activeView="accounts"
      headerLabel={accountData.account.name}
      accounts={accounts}
      profileName={profile.full_name || profile.email || "ContextIQ"}
      gmailStatus={gmailStatus}
      linkedInStatus={linkedInStatus}
      outlookStatus={outlookStatus}
      slackStatus={slackStatus}
      activeAccountId={accountId}
    >
      <AccountPageClient
        workspaceId={workspace.id}
        allAccounts={accounts}
        initialData={accountData}
      />
    </WorkspaceShell>
  );
}
