"use client";

import { FormEvent, useState, useTransition } from "react";

import { createNoteAction } from "@/lib/actions/contextiq";
import type { Contact, Note } from "@/types";

export function CreateNoteForm({
  workspaceId,
  accountId,
  contacts,
  onCreated,
}: {
  workspaceId: string;
  accountId: string;
  contacts: Contact[];
  onCreated?: (note: Note) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contactId, setContactId] = useState("");
  const [sourceType, setSourceType] = useState("manual_note");
  const [topic, setTopic] = useState("");
  const [importanceLevel, setImportanceLevel] = useState("medium");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        setError(null);
        const note = await createNoteAction({
          workspaceId,
          accountId,
          contactId: contactId || null,
          title,
          content,
          sourceType,
          topic,
          importanceLevel,
        });
        setTitle("");
        setContent("");
        setTopic("");
        onCreated?.(note);
      } catch (submitError) {
        setError(
          submitError instanceof Error ? submitError.message : "Failed to save note.",
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
          Add note
        </h3>
      </div>
      <div className="space-y-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] font-medium outline-none focus:border-[#2563EB] focus:bg-white"
        />
        <textarea
          required
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Capture blocker, preference, commitment, or context..."
          className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] font-medium outline-none focus:border-[#2563EB] focus:bg-white"
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <select
            value={contactId}
            onChange={(event) => setContactId(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] font-medium outline-none focus:border-[#2563EB] focus:bg-white"
          >
            <option value="">All stakeholders</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>
            ))}
          </select>
          <select
            value={sourceType}
            onChange={(event) => setSourceType(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] font-medium outline-none focus:border-[#2563EB] focus:bg-white"
          >
            {[
              "manual_note",
              "meeting_note",
              "call_summary",
              "email_summary",
              "transcript",
            ].map((option) => (
              <option key={option} value={option}>
                {option.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Topic"
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
        </div>
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
        {isPending ? "Saving..." : "Add note"}
      </button>
    </form>
  );
}
