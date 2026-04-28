"use client";

import { FormEvent, useState, useTransition } from "react";

import { createContactAction } from "@/lib/actions/contextiq";
import type { Account, Contact } from "@/types";

export function CreateContactForm({
  workspaceId,
  accounts,
  defaultAccountId,
  onCreated,
}: {
  workspaceId: string;
  accounts: Account[];
  defaultAccountId?: string;
  onCreated?: (contact: Contact) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [accountId, setAccountId] = useState(defaultAccountId ?? accounts[0]?.id ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [roleType, setRoleType] = useState("champion");
  const [communicationStyle, setCommunicationStyle] = useState("");
  const [preferenceSummary, setPreferenceSummary] = useState("");
  const [importanceLevel, setImportanceLevel] = useState("medium");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        setError(null);
        const created = await createContactAction({
          workspaceId,
          accountId,
          name,
          email,
          title,
          roleType,
          communicationStyle,
          preferenceSummary,
          importanceLevel,
        });
        setName("");
        setEmail("");
        setTitle("");
        setCommunicationStyle("");
        setPreferenceSummary("");
        onCreated?.(created);
      } catch (submitError) {
        setError(
          submitError instanceof Error ? submitError.message : "Failed to create contact.",
        );
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-5">
        <h3 className="text-[14px] font-bold uppercase tracking-widest text-slate-400">
          Create contact
        </h3>
        <p className="mt-2 text-[14px] font-medium text-slate-500">
          Attach real stakeholders to the workspace account graph.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <select
          value={accountId}
          onChange={(event) => setAccountId(event.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] font-medium outline-none focus:border-[#2563EB] focus:bg-white md:col-span-2"
        >
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Contact name"
          className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] font-medium outline-none focus:border-[#2563EB] focus:bg-white"
        />
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] font-medium outline-none focus:border-[#2563EB] focus:bg-white"
        />
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] font-medium outline-none focus:border-[#2563EB] focus:bg-white"
        />
        <select
          value={roleType}
          onChange={(event) => setRoleType(event.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] font-medium outline-none focus:border-[#2563EB] focus:bg-white"
        >
          {[
            "champion",
            "economic_buyer",
            "technical_buyer",
            "procurement",
            "decision_maker",
            "end_user",
            "other",
          ].map((option) => (
            <option key={option} value={option}>
              {option.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <input
          value={communicationStyle}
          onChange={(event) => setCommunicationStyle(event.target.value)}
          placeholder="Communication style"
          className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] font-medium outline-none focus:border-[#2563EB] focus:bg-white"
        />
        <select
          value={importanceLevel}
          onChange={(event) => setImportanceLevel(event.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] font-medium outline-none focus:border-[#2563EB] focus:bg-white"
        >
          {["low", "medium", "high", "critical"].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <textarea
          value={preferenceSummary}
          onChange={(event) => setPreferenceSummary(event.target.value)}
          placeholder="Preference summary"
          className="min-h-[96px] rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] font-medium outline-none focus:border-[#2563EB] focus:bg-white md:col-span-2"
        />
      </div>
      {error ? (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-medium text-rose-700">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="mt-4 rounded-xl bg-[#0F172A] px-4 py-3 text-[13px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
      >
        {isPending ? "Creating..." : "Create contact"}
      </button>
    </form>
  );
}
