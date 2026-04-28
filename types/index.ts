export type ActionType =
  | "prepare_meeting"
  | "draft_followup"
  | "summarize_blockers"
  | "what_changed_recently";

export type NoteSourceType =
  | "manual_note"
  | "meeting_note"
  | "call_summary"
  | "email_summary"
  | "transcript"
  | "uploaded_document"
  | "crm_import";

export type ImportanceLevel = "low" | "medium" | "high" | "critical";

export type AccountStage =
  | "prospect"
  | "discovery"
  | "evaluation"
  | "negotiation"
  | "customer"
  | "at_risk"
  | "closed_won"
  | "closed_lost";

export type AccountPriority = ImportanceLevel;

export type ContactRoleType =
  | "champion"
  | "economic_buyer"
  | "technical_buyer"
  | "procurement"
  | "end_user"
  | "decision_maker"
  | "other";

export type ActivityType =
  | "email_sent"
  | "email_received"
  | "call_logged"
  | "meeting_logged"
  | "note_added"
  | "status_changed"
  | "task_created"
  | "document_uploaded";

export interface RecalledMemoryMetadata {
  workspace_id: string;
  account_id: string;
  contact_id?: string | null;
  source_type: string;
  topic?: string | null;
  importance_level?: string | null;
  stage?: string | null;
  created_at: string;
  created_by?: string | null;
  entity_type: string;
  account_name?: string | null;
  contact_name?: string | null;
  contact_role_type?: string | null;
  integration_source?: "gmail" | "linkedin" | null;
}

export interface RecalledMemory {
  id?: string;
  content: string;
  metadata: RecalledMemoryMetadata;
  score?: number;
}

export type ContextMemoryType =
  | "BLOCKER"
  | "PREFERENCE"
  | "COMMITMENT"
  | "CONTEXT";

export interface ContextRailItem {
  id: string;
  type: ContextMemoryType;
  relationLabel: string | null;
  sourceLabel: string;
  dateLabel: string;
  whyRecalled: string;
  content: string;
  accentClassName: string;
  badgeClassName: string;
  iconClassName: string;
  rawMemory: RecalledMemory;
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

export interface Workspace {
  id: string;
  owner_id: string;
  name: string;
  slug: string | null;
  description: string | null;
  hydradb_tenant_id: string;
}

export interface Account {
  id: string;
  workspace_id: string;
  name: string;
  domain: string | null;
  industry: string | null;
  stage: AccountStage;
  priority: AccountPriority;
  arr_estimate: number | null;
  owner_name: string | null;
  notes_summary: string | null;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  workspace_id: string;
  account_id: string;
  name: string;
  email: string | null;
  title: string | null;
  role_type: ContactRoleType | null;
  communication_style: string | null;
  preference_summary: string | null;
  importance_level: ImportanceLevel;
  linkedin_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  workspace_id: string;
  account_id: string;
  contact_id: string | null;
  author_id: string | null;
  title: string | null;
  content: string;
  source_type: NoteSourceType;
  topic: string | null;
  importance_level: ImportanceLevel;
  hydradb_memory_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityRecord {
  id: string;
  workspace_id: string;
  account_id: string;
  contact_id: string | null;
  actor_id: string | null;
  activity_type: ActivityType;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  occurred_at: string;
  created_at: string;
  hydradb_memory_id?: string | null;
}

export interface GeneratedOutput {
  id: string;
  workspace_id: string;
  account_id: string;
  contact_id: string | null;
  action_type: ActionType;
  prompt: string | null;
  output_text: string;
  recalled_memories_json: RecalledMemory[];
  model_name: string | null;
  created_by: string | null;
  created_at: string;
}

export interface TimelineItem {
  id: string;
  type: "email" | "note" | "call" | "status" | "task";
  title: string;
  description?: string | null;
  dateLabel: string;
  userLabel: string;
  tag?: string | null;
  highlight?: boolean;
  accountId?: string;
  accountName?: string;
}

export interface AccountWithContacts extends Account {
  contacts: Contact[];
}

export interface AccountPageData {
  account: Account;
  contacts: Contact[];
  activities: ActivityRecord[];
  notes: Note[];
  timeline: TimelineItem[];
  latest_output: GeneratedOutput | null;
  recent_outputs: GeneratedOutput[];
  memory_rail: RecalledMemory[];
}

export interface WorkspaceOverviewData {
  workspace: Workspace;
  profile: Profile;
  accounts: Account[];
  contacts: Contact[];
  recent_activities: ActivityRecord[];
  recent_notes: Note[];
  recent_outputs: GeneratedOutput[];
}

export interface OverviewCardSignal {
  title: string;
  subtitle: string;
  account_id?: string;
}

export interface ComposerResult {
  output: GeneratedOutput;
  memories: RecalledMemory[];
  draft_preview?: string;
  send_confirmation_required?: boolean;
}

export interface GmailIntegration {
  id: string;
  workspace_id: string;
  user_id: string;
  provider: string;
  email: string | null;
  access_token_encrypted: string;
  refresh_token_encrypted: string | null;
  token_type: string | null;
  scopes: string[];
  expires_at: string | null;
  connected_at: string;
  last_synced_at: string | null;
  sync_status: "idle" | "syncing" | "ok" | "error";
  last_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface GmailIntegrationStatus {
  connected: boolean;
  email: string | null;
  last_synced_at: string | null;
  sync_status: "idle" | "syncing" | "ok" | "error";
  last_error: string | null;
}

export interface GmailSyncResult {
  fetched: number;
  imported: number;
  skipped: number;
  failed: number;
}

export interface LinkedInIntegration {
  id: string;
  workspace_id: string;
  user_id: string;
  provider: string;
  linkedin_sub: string | null;
  email: string | null;
  access_token_encrypted: string;
  refresh_token_encrypted: string | null;
  token_type: string | null;
  scopes: string[];
  expires_at: string | null;
  connected_at: string;
  last_synced_at: string | null;
  sync_status: "idle" | "syncing" | "ok" | "error";
  last_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface LinkedInIntegrationStatus {
  connected: boolean;
  email: string | null;
  linkedin_sub: string | null;
  last_synced_at: string | null;
  sync_status: "idle" | "syncing" | "ok" | "error";
  last_error: string | null;
}

export interface LinkedInSyncResult {
  scanned: number;
  imported: number;
  skipped: number;
  failed: number;
}

export interface GmailFollowUpDraftResult {
  draft_preview: string;
  send_confirmation_required: true;
  generated_output_id: string;
  suggested_subject: string;
  to_email: string;
}

export interface GmailSendResult {
  message_id: string;
  thread_id: string | null;
  label_ids: string[];
  generated_output_id: string;
}
