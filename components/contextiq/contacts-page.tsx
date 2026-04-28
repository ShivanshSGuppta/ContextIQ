import Link from "next/link";
import type { Route } from "next";

import { CreateContactForm } from "@/components/forms/create-contact-form";
import { getInitials } from "@/lib/utils";
import type { Account, Contact } from "@/types";

export function ContactsPage({
  workspaceId,
  accounts,
  contacts,
  basePath = "",
  showCreate = true,
}: {
  workspaceId: string;
  accounts: Account[];
  contacts: Contact[];
  basePath?: string;
  showCreate?: boolean;
}) {
  return (
    <div className="mx-auto max-w-6xl px-10 py-12">
      <div className="mb-10 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.95fr]">
        <div>
          <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-[#0F172A]">
            All Contacts
          </h1>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {contacts.map((contact) => {
              const account = accounts.find((item) => item.id === contact.account_id);

              return (
                <Link
                  key={contact.id}
                  href={`${basePath}/accounts/${contact.account_id}` as Route}
                  className="group flex items-center gap-6 border-b border-slate-100 p-6 transition-colors hover:bg-slate-50 last:border-b-0"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-[14px] font-bold text-slate-700 shadow-sm transition-all group-hover:border group-hover:border-slate-200 group-hover:bg-white">
                    {getInitials(contact.name)}
                  </div>
                  <div className="grid flex-1 grid-cols-1 items-center gap-6 md:grid-cols-3">
                    <div>
                      <p className="text-[16px] font-bold text-[#0F172A]">{contact.name}</p>
                      <p className="text-[14px] font-medium text-slate-500">
                        {contact.title || "Stakeholder"} <span className="mx-1.5 text-slate-300">•</span>
                        {account?.name}
                      </p>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between gap-4">
                      <div className="max-w-md truncate rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-[13px] font-medium text-slate-600">
                        {contact.preference_summary ||
                          contact.communication_style ||
                          contact.role_type?.replaceAll("_", " ") ||
                          "No preference summary yet"}
                      </div>
                      <span className="rounded-lg border border-slate-200 px-4 py-2.5 text-[12px] font-bold uppercase tracking-widest text-slate-600 shadow-sm">
                        View Context
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        {showCreate ? <CreateContactForm workspaceId={workspaceId} accounts={accounts} /> : null}
      </div>
    </div>
  );
}
