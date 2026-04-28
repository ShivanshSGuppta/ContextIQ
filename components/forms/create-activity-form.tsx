"use client";

import { FormEvent, useState, useTransition } from "react";

import { createActivityAction } from "@/lib/actions/contextiq";
import type { ActivityRecord, Contact } from "@/types";

export function CreateActivityForm({
  workspaceId,
  accountId,
  contacts,
  onCreated,
}: {
  workspaceId: string;
  accountId: string;
  contacts: Contact[];
  onCreated?: (activity: ActivityRecord) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [activityType, setActivityType] = useState("meeting_logged");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contactId, setContactId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        setError(null);
        const activity = await createActivityAction({
          workspaceId,
          accountId,
          contactId: contactId || null,
          activityType,
          title,
          description,
          occurredAt: new Date().toISOString(),
        });
        setTitle("");
        setDescription("");
        onCreated?.(activity);
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Failed to create activity.",
        );
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-4">
        <h3 className="text-[12px] font-bold uppercase tracking-widest text-slate-400">
          Add activity
        </h3>
      </div>
      <div className="space-y-3">
        <select
          value={activityType}
          onChange={(event) => setActivityType(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] font-medium outline-none focus:border-[#2563EB] focus:bg-white"
        >
          {[
            "email_sent",
            "email_received",
            "call_logged",
            "meeting_logged",
            "status_changed",
            "task_created",
            "document_uploaded",
          ].map((option) => (
            <option key={option} value={option}>
              {option.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <input
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Activity title"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] font-medium outline-none focus:border-[#2563EB] focus:bg-white"
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Optional activity summary for the timeline and HydraDB recall..."
          className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] font-medium outline-none focus:border-[#2563EB] focus:bg-white"
        />
        <select
          value={contactId}
          onChange={(event) => setContactId(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] font-medium outline-none focus:border-[#2563EB] focus:bg-white"
        >
          <option value="">All stakeholders</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.name}
            </option>
          ))}
        </select>
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
        {isPending ? "Saving..." : "Add activity"}
      </button>
    </form>
  );
}
