import Link from "next/link";
import type { Route } from "next";
import { AlertTriangle, Briefcase, Calendar, MessageSquare, ShieldAlert, Zap } from "lucide-react";

import { CreateAccountForm } from "@/components/forms/create-account-form";
import { Badge } from "@/components/contextiq/primitives";
import { deriveAccountsNeedingAttention, deriveRecentMemorySignals, deriveSuggestedNextActions } from "@/lib/data/contextiq";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import type { WorkspaceOverviewData } from "@/types";

export function OverviewPage({
  data,
  basePath = "",
  showCreate = true,
}: {
  data: WorkspaceOverviewData;
  basePath?: string;
  showCreate?: boolean;
}) {
  const accountsNeedingAttention = deriveAccountsNeedingAttention(data);
  const nextActions = deriveSuggestedNextActions(data);
  const recentSignals = deriveRecentMemorySignals(data);

  return (
    <div className="mx-auto max-w-6xl px-10 py-12">
      <div className="mb-12 grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100 md:grid-cols-3 md:divide-x md:divide-y-0">
        <div className="flex items-center gap-5 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600">
            <Briefcase size={20} />
          </div>
          <div>
            <p className="text-[16px] font-bold leading-tight text-[#0F172A]">
              {data.accounts.length} Accounts
            </p>
            <p className="mt-1 text-[14px] font-medium text-slate-500">
              Tracked in the live workspace
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#F5CACA] bg-[#FDECEC] text-[#991B1B]">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p className="text-[16px] font-bold leading-tight text-[#0F172A]">
              {
                data.recent_notes.filter(
                  (note) => note.importance_level === "high" || note.importance_level === "critical",
                ).length
              }{" "}
              High-signal notes
            </p>
            <p className="mt-1 text-[14px] font-medium text-slate-500">
              Ready for memory recall
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#F4DFC1] bg-[#FFF4E8] text-[#B45309]">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-[16px] font-bold leading-tight text-[#0F172A]">
              {data.recent_outputs.length} Generated outputs
            </p>
            <p className="mt-1 text-[14px] font-medium text-slate-500">
              Saved with traceable memory history
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div>
          <h2 className="mb-6 text-[12px] font-bold uppercase tracking-widest text-slate-400">
            Accounts Needing Attention
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {accountsNeedingAttention.map((account) => (
                <Link
                  key={account.id}
                  href={`${basePath}/accounts/${account.id}` as Route}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-slate-300 hover:shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
              >
                <div className="mb-6 flex items-start justify-between">
                  <Badge
                    className={
                      account.stage === "at_risk"
                        ? "border-[#F5CACA] bg-[#FDECEC] text-[#991B1B]"
                        : ""
                    }
                  >
                    {account.stage.replaceAll("_", " ")}
                  </Badge>
                  <span className="text-[12px] font-bold text-slate-400">
                    {formatRelativeDate(account.last_contacted_at)}
                  </span>
                </div>
                <h3 className="mb-2 text-[20px] font-bold text-[#0F172A]">{account.name}</h3>
                <p className="mb-6 text-[15px] font-semibold text-slate-500">
                  {formatCurrency(account.arr_estimate)}
                </p>
                <div className="mt-auto border-t border-slate-100 pt-5">
                  <p className="text-[14px] font-medium leading-relaxed text-slate-600">
                    <span className="font-bold text-[#0F172A]">Owner:</span>{" "}
                    {account.owner_name || "Unassigned"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {showCreate ? <CreateAccountForm workspaceId={data.workspace.id} /> : null}
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <h2 className="mb-5 text-[12px] font-bold uppercase tracking-widest text-slate-400">
            Suggested Next Actions
          </h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {nextActions.map((item, index) => (
                <Link
                  key={`${item.title}-${index}`}
                  href={
                    (item.account_id
                      ? `${basePath}/accounts/${item.account_id}`
                      : `${basePath}/overview`) as Route
                  }
                className="flex items-center gap-5 border-b border-slate-100 p-6 transition-colors hover:bg-slate-50 last:border-b-0"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF1FF] text-[#2563EB]">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-[#0F172A]">{item.title}</p>
                  <p className="mt-1 text-[14px] font-medium text-slate-500">{item.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-[12px] font-bold uppercase tracking-widest text-slate-400">
            Recent Memory Signals
          </h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {recentSignals.map((item, index) => (
                <Link
                  key={`${item.title}-${index}`}
                  href={
                    (item.account_id
                      ? `${basePath}/accounts/${item.account_id}`
                      : `${basePath}/overview`) as Route
                  }
                className="flex items-center gap-5 border-b border-slate-100 p-6 transition-colors hover:bg-slate-50 last:border-b-0"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF4E8] text-[#B45309]">
                  {index % 2 === 0 ? <Zap size={18} /> : <Calendar size={18} />}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-[#0F172A]">{item.title}</p>
                  <p className="mt-1 text-[14px] font-medium text-slate-500">{item.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
