import { z } from "zod";

export const createAccountSchema = z.object({
  workspaceId: z.uuid(),
  name: z.string().min(2).max(120),
  domain: z.string().max(255).optional().or(z.literal("")),
  industry: z.string().max(120).optional().or(z.literal("")),
  stage: z.enum([
    "prospect",
    "discovery",
    "evaluation",
    "negotiation",
    "customer",
    "at_risk",
    "closed_won",
    "closed_lost",
  ]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  arrEstimate: z.coerce.number().min(0).optional(),
  ownerName: z.string().max(120).optional().or(z.literal("")),
});

export const createContactSchema = z.object({
  workspaceId: z.uuid(),
  accountId: z.uuid(),
  name: z.string().min(2).max(120),
  email: z.email().optional().or(z.literal("")),
  title: z.string().max(120).optional().or(z.literal("")),
  roleType: z
    .enum([
      "champion",
      "economic_buyer",
      "technical_buyer",
      "procurement",
      "end_user",
      "decision_maker",
      "other",
    ])
    .optional(),
  communicationStyle: z.string().max(240).optional().or(z.literal("")),
  preferenceSummary: z.string().max(500).optional().or(z.literal("")),
  importanceLevel: z.enum(["low", "medium", "high", "critical"]),
});

export const createNoteSchema = z.object({
  workspaceId: z.uuid(),
  accountId: z.uuid(),
  contactId: z.uuid().nullable().optional(),
  title: z.string().max(160).optional().or(z.literal("")),
  content: z.string().min(8).max(5000),
  sourceType: z.enum([
    "manual_note",
    "meeting_note",
    "call_summary",
    "email_summary",
    "transcript",
    "uploaded_document",
    "crm_import",
  ]),
  topic: z.string().max(120).optional().or(z.literal("")),
  importanceLevel: z.enum(["low", "medium", "high", "critical"]),
});

export const createActivitySchema = z.object({
  workspaceId: z.uuid(),
  accountId: z.uuid(),
  contactId: z.uuid().nullable().optional(),
  activityType: z.enum([
    "email_sent",
    "email_received",
    "call_logged",
    "meeting_logged",
    "note_added",
    "status_changed",
    "task_created",
    "document_uploaded",
  ]),
  title: z.string().min(4).max(160),
  description: z.string().max(4000).optional().or(z.literal("")),
  occurredAt: z.string().optional(),
});

export const runActionSchema = z.object({
  workspaceId: z.uuid(),
  accountId: z.uuid(),
  contactId: z.uuid().nullable().optional(),
  actionType: z.enum([
    "prepare_meeting",
    "draft_followup",
    "summarize_blockers",
    "what_changed_recently",
  ]),
  prompt: z.string().max(4000).optional().or(z.literal("")),
});

export const prepareGmailFollowUpSchema = z.object({
  workspaceId: z.uuid(),
  accountId: z.uuid(),
  contactId: z.uuid().nullable().optional(),
  toEmail: z.email(),
  subject: z.string().min(3).max(220).optional().or(z.literal("")),
  prompt: z.string().max(4000).optional().or(z.literal("")),
});

export const sendGmailFollowUpSchema = z.object({
  workspaceId: z.uuid(),
  accountId: z.uuid(),
  contactId: z.uuid().nullable().optional(),
  toEmail: z.email(),
  subject: z.string().min(3).max(220),
  body: z.string().min(8).max(12000),
  generatedOutputId: z.uuid(),
  confirmSend: z.literal(true),
});
