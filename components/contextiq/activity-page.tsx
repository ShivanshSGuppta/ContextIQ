import Link from "next/link";
import type { Route } from "next";
import { Activity, Calendar, Mail, Phone } from "lucide-react";

import { formatDateTime } from "@/lib/utils";
import type { ActivityRecord, Account } from "@/types";

export function ActivityPage({
  activities,
  accounts,
  basePath = "",
}: {
  activities: ActivityRecord[];
  accounts: Account[];
  basePath?: string;
}) {
  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="mb-12 text-3xl font-extrabold tracking-tight text-[#0F172A]">
        Activity Stream
      </h1>
      <div className="ml-2">
        {activities.map((activity) => {
          const account = accounts.find((item) => item.id === activity.account_id);
          const Icon =
            activity.activity_type.includes("email")
              ? Mail
              : activity.activity_type.includes("call") ||
                  activity.activity_type.includes("meeting")
                ? Phone
                : activity.activity_type.includes("note")
                  ? Calendar
                  : Activity;

          return (
            <Link
              key={activity.id}
              href={`${basePath}/accounts/${activity.account_id}` as Route}
              className="group flex gap-6"
            >
              <div className="flex flex-col items-center">
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-colors group-hover:border-slate-300 group-hover:text-slate-600">
                  <Icon size={18} />
                </div>
                <div className="group-last:hidden -mb-2 mt-2 h-full w-px bg-slate-200" />
              </div>
              <div className="flex-1 pb-12 pt-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[16px] font-bold tracking-tight text-slate-800">
                    {activity.title}
                  </p>
                  <span className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    {activity.activity_type.replaceAll("_", " ")}
                  </span>
                </div>
                <p className="mt-1.5 text-[14px] font-medium text-slate-500">
                  {formatDateTime(activity.occurred_at)} • {account?.name ?? "Unknown account"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
