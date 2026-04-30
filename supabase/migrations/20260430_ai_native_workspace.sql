create table if not exists public.integration_connections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null,
  display_name text,
  status text not null default 'pending_approval' check (
    status in ('connected', 'pending_approval', 'error', 'disconnected')
  ),
  capabilities jsonb not null default '{}'::jsonb,
  permission_scope text,
  access_token_encrypted text,
  refresh_token_encrypted text,
  expires_at timestamptz,
  source_provider text not null,
  source_object_type text not null default 'integration_connection',
  source_object_id text not null,
  dedupe_key text not null,
  raw_payload_ref text,
  normalized_payload jsonb not null default '{}'::jsonb,
  embedding_status text not null default 'not_indexed',
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, provider, owner_user_id),
  unique (workspace_id, dedupe_key)
);

create table if not exists public.integration_sync_runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_user_id uuid not null references public.profiles(id) on delete cascade,
  integration_connection_id uuid references public.integration_connections(id) on delete set null,
  provider text not null,
  status text not null default 'started' check (
    status in ('started', 'ok', 'partial', 'error')
  ),
  imported_count integer not null default 0,
  skipped_count integer not null default 0,
  failed_count integer not null default 0,
  details jsonb not null default '{}'::jsonb,
  source_provider text not null,
  source_object_type text not null default 'integration_sync_run',
  source_object_id text not null,
  dedupe_key text not null,
  raw_payload_ref text,
  normalized_payload jsonb not null default '{}'::jsonb,
  embedding_status text not null default 'not_indexed',
  permission_scope text,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, dedupe_key)
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_user_id uuid references public.profiles(id) on delete set null,
  account_id uuid references public.accounts(id) on delete set null,
  name text not null,
  domain text,
  industry text,
  health_score integer,
  source_provider text not null,
  source_object_type text not null default 'organization',
  source_object_id text not null,
  dedupe_key text not null,
  raw_payload_ref text,
  normalized_payload jsonb not null default '{}'::jsonb,
  embedding_status text not null default 'not_indexed',
  permission_scope text,
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, dedupe_key)
);

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_user_id uuid references public.profiles(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  full_name text not null,
  email text,
  title text,
  linkedin_url text,
  phone text,
  source_provider text not null,
  source_object_type text not null default 'person',
  source_object_id text not null,
  dedupe_key text not null,
  raw_payload_ref text,
  normalized_payload jsonb not null default '{}'::jsonb,
  embedding_status text not null default 'not_indexed',
  permission_scope text,
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, dedupe_key)
);

create table if not exists public.identity_aliases (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_user_id uuid references public.profiles(id) on delete set null,
  person_id uuid not null references public.people(id) on delete cascade,
  provider text not null,
  alias_type text not null,
  alias_value text not null,
  source_provider text not null,
  source_object_type text not null default 'identity_alias',
  source_object_id text not null,
  dedupe_key text not null,
  raw_payload_ref text,
  normalized_payload jsonb not null default '{}'::jsonb,
  embedding_status text not null default 'not_indexed',
  permission_scope text,
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, dedupe_key)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_user_id uuid references public.profiles(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  person_id uuid references public.people(id) on delete set null,
  channel text not null,
  subject text,
  status text,
  last_message_at timestamptz,
  source_provider text not null,
  source_object_type text not null default 'conversation',
  source_object_id text not null,
  dedupe_key text not null,
  raw_payload_ref text,
  normalized_payload jsonb not null default '{}'::jsonb,
  embedding_status text not null default 'not_indexed',
  permission_scope text,
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, dedupe_key)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_user_id uuid references public.profiles(id) on delete set null,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  person_id uuid references public.people(id) on delete set null,
  direction text not null check (direction in ('inbound', 'outbound', 'internal')),
  body text not null,
  sent_at timestamptz,
  source_provider text not null,
  source_object_type text not null default 'message',
  source_object_id text not null,
  dedupe_key text not null,
  raw_payload_ref text,
  normalized_payload jsonb not null default '{}'::jsonb,
  embedding_status text not null default 'not_indexed',
  permission_scope text,
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, dedupe_key)
);

create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_user_id uuid references public.profiles(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  topic text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  status text,
  attendee_person_ids uuid[] not null default '{}'::uuid[],
  source_provider text not null,
  source_object_type text not null default 'meeting',
  source_object_id text not null,
  dedupe_key text not null,
  raw_payload_ref text,
  normalized_payload jsonb not null default '{}'::jsonb,
  embedding_status text not null default 'not_indexed',
  permission_scope text,
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, dedupe_key)
);

create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_user_id uuid references public.profiles(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  account_id uuid references public.accounts(id) on delete set null,
  title text not null,
  stage text,
  amount numeric(12,2),
  close_date date,
  source_provider text not null,
  source_object_type text not null default 'deal',
  source_object_id text not null,
  dedupe_key text not null,
  raw_payload_ref text,
  normalized_payload jsonb not null default '{}'::jsonb,
  embedding_status text not null default 'not_indexed',
  permission_scope text,
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, dedupe_key)
);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_user_id uuid references public.profiles(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  person_id uuid references public.people(id) on delete set null,
  title text not null,
  status text,
  priority text,
  source_provider text not null,
  source_object_type text not null default 'ticket',
  source_object_id text not null,
  dedupe_key text not null,
  raw_payload_ref text,
  normalized_payload jsonb not null default '{}'::jsonb,
  embedding_status text not null default 'not_indexed',
  permission_scope text,
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, dedupe_key)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_user_id uuid references public.profiles(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  person_id uuid references public.people(id) on delete set null,
  meeting_id uuid references public.meetings(id) on delete set null,
  deal_id uuid references public.deals(id) on delete set null,
  title text not null,
  description text,
  status text,
  due_at timestamptz,
  source_provider text not null,
  source_object_type text not null default 'task',
  source_object_id text not null,
  dedupe_key text not null,
  raw_payload_ref text,
  normalized_payload jsonb not null default '{}'::jsonb,
  embedding_status text not null default 'not_indexed',
  permission_scope text,
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, dedupe_key)
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_user_id uuid references public.profiles(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  person_id uuid references public.people(id) on delete set null,
  title text not null,
  body text,
  kind text,
  source_provider text not null,
  source_object_type text not null default 'document',
  source_object_id text not null,
  dedupe_key text not null,
  raw_payload_ref text,
  normalized_payload jsonb not null default '{}'::jsonb,
  embedding_status text not null default 'not_indexed',
  permission_scope text,
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, dedupe_key)
);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_user_id uuid references public.profiles(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  person_id uuid references public.people(id) on delete set null,
  event_type text not null,
  summary text not null,
  occurred_at timestamptz not null default now(),
  source_provider text not null,
  source_object_type text not null default 'timeline_event',
  source_object_id text not null,
  dedupe_key text not null,
  raw_payload_ref text,
  normalized_payload jsonb not null default '{}'::jsonb,
  embedding_status text not null default 'not_indexed',
  permission_scope text,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, dedupe_key)
);

create table if not exists public.action_executions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_user_id uuid not null references public.profiles(id) on delete cascade,
  action_type text not null,
  source_entity_type text,
  source_entity_id text,
  writeback_provider text,
  writeback_ref text,
  input_payload jsonb not null default '{}'::jsonb,
  output_payload jsonb not null default '{}'::jsonb,
  ai_generated boolean not null default true,
  approval_state text not null default 'auto_executed' check (
    approval_state in ('auto_executed', 'approved', 'rejected')
  ),
  source_provider text not null,
  source_object_type text not null default 'action_execution',
  source_object_id text not null,
  dedupe_key text not null,
  raw_payload_ref text,
  normalized_payload jsonb not null default '{}'::jsonb,
  embedding_status text not null default 'not_indexed',
  permission_scope text,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, dedupe_key)
);

create table if not exists public.search_index_entries (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_user_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  title text,
  body text not null,
  metadata jsonb not null default '{}'::jsonb,
  source_provider text not null,
  source_object_type text not null default 'search_index_entry',
  source_object_id text not null,
  dedupe_key text not null,
  raw_payload_ref text,
  normalized_payload jsonb not null default '{}'::jsonb,
  embedding_status text not null default 'pending',
  permission_scope text,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, dedupe_key)
);

create table if not exists public.embedding_chunks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_user_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  chunk_index integer not null,
  content text not null,
  embedding_status text not null default 'pending',
  source_provider text not null,
  source_object_type text not null default 'embedding_chunk',
  source_object_id text not null,
  dedupe_key text not null,
  raw_payload_ref text,
  normalized_payload jsonb not null default '{}'::jsonb,
  permission_scope text,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, dedupe_key)
);

create index if not exists idx_integration_connections_workspace_provider
  on public.integration_connections(workspace_id, provider, status);
create index if not exists idx_integration_sync_runs_workspace_provider
  on public.integration_sync_runs(workspace_id, provider, created_at desc);
create index if not exists idx_organizations_workspace_name
  on public.organizations(workspace_id, name);
create index if not exists idx_people_workspace_name
  on public.people(workspace_id, full_name);
create index if not exists idx_identity_aliases_workspace_person
  on public.identity_aliases(workspace_id, person_id, provider);
create index if not exists idx_conversations_workspace_org
  on public.conversations(workspace_id, organization_id, last_message_at desc);
create index if not exists idx_messages_workspace_conversation
  on public.messages(workspace_id, conversation_id, sent_at desc);
create index if not exists idx_meetings_workspace_starts_at
  on public.meetings(workspace_id, starts_at desc);
create index if not exists idx_deals_workspace_stage
  on public.deals(workspace_id, stage);
create index if not exists idx_tickets_workspace_status
  on public.tickets(workspace_id, status);
create index if not exists idx_tasks_workspace_due
  on public.tasks(workspace_id, due_at desc);
create index if not exists idx_timeline_events_workspace_occurred
  on public.timeline_events(workspace_id, occurred_at desc);
create index if not exists idx_action_executions_workspace_created
  on public.action_executions(workspace_id, created_at desc);
create index if not exists idx_search_index_entries_workspace_entity
  on public.search_index_entries(workspace_id, entity_type, entity_id);
create index if not exists idx_embedding_chunks_workspace_entity
  on public.embedding_chunks(workspace_id, entity_type, entity_id, chunk_index);

drop trigger if exists set_integration_connections_updated_at on public.integration_connections;
create trigger set_integration_connections_updated_at
before update on public.integration_connections
for each row execute function public.set_updated_at();

drop trigger if exists set_integration_sync_runs_updated_at on public.integration_sync_runs;
create trigger set_integration_sync_runs_updated_at
before update on public.integration_sync_runs
for each row execute function public.set_updated_at();

drop trigger if exists set_organizations_updated_at on public.organizations;
create trigger set_organizations_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

drop trigger if exists set_people_updated_at on public.people;
create trigger set_people_updated_at
before update on public.people
for each row execute function public.set_updated_at();

drop trigger if exists set_identity_aliases_updated_at on public.identity_aliases;
create trigger set_identity_aliases_updated_at
before update on public.identity_aliases
for each row execute function public.set_updated_at();

drop trigger if exists set_conversations_updated_at on public.conversations;
create trigger set_conversations_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

drop trigger if exists set_messages_updated_at on public.messages;
create trigger set_messages_updated_at
before update on public.messages
for each row execute function public.set_updated_at();

drop trigger if exists set_meetings_updated_at on public.meetings;
create trigger set_meetings_updated_at
before update on public.meetings
for each row execute function public.set_updated_at();

drop trigger if exists set_deals_updated_at on public.deals;
create trigger set_deals_updated_at
before update on public.deals
for each row execute function public.set_updated_at();

drop trigger if exists set_tickets_updated_at on public.tickets;
create trigger set_tickets_updated_at
before update on public.tickets
for each row execute function public.set_updated_at();

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

drop trigger if exists set_documents_updated_at on public.documents;
create trigger set_documents_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

drop trigger if exists set_timeline_events_updated_at on public.timeline_events;
create trigger set_timeline_events_updated_at
before update on public.timeline_events
for each row execute function public.set_updated_at();

drop trigger if exists set_action_executions_updated_at on public.action_executions;
create trigger set_action_executions_updated_at
before update on public.action_executions
for each row execute function public.set_updated_at();

drop trigger if exists set_search_index_entries_updated_at on public.search_index_entries;
create trigger set_search_index_entries_updated_at
before update on public.search_index_entries
for each row execute function public.set_updated_at();

drop trigger if exists set_embedding_chunks_updated_at on public.embedding_chunks;
create trigger set_embedding_chunks_updated_at
before update on public.embedding_chunks
for each row execute function public.set_updated_at();

alter table public.integration_connections enable row level security;
alter table public.integration_sync_runs enable row level security;
alter table public.organizations enable row level security;
alter table public.people enable row level security;
alter table public.identity_aliases enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.meetings enable row level security;
alter table public.deals enable row level security;
alter table public.tickets enable row level security;
alter table public.tasks enable row level security;
alter table public.documents enable row level security;
alter table public.timeline_events enable row level security;
alter table public.action_executions enable row level security;
alter table public.search_index_entries enable row level security;
alter table public.embedding_chunks enable row level security;

drop policy if exists "integration_connections_select_member" on public.integration_connections;
create policy "integration_connections_select_member" on public.integration_connections
for select using (public.is_workspace_member(workspace_id));
drop policy if exists "integration_connections_insert_member" on public.integration_connections;
create policy "integration_connections_insert_member" on public.integration_connections
for insert with check (public.is_workspace_member(workspace_id));
drop policy if exists "integration_connections_update_member" on public.integration_connections;
create policy "integration_connections_update_member" on public.integration_connections
for update using (public.is_workspace_member(workspace_id));

drop policy if exists "integration_sync_runs_select_member" on public.integration_sync_runs;
create policy "integration_sync_runs_select_member" on public.integration_sync_runs
for select using (public.is_workspace_member(workspace_id));
drop policy if exists "integration_sync_runs_insert_member" on public.integration_sync_runs;
create policy "integration_sync_runs_insert_member" on public.integration_sync_runs
for insert with check (public.is_workspace_member(workspace_id));

drop policy if exists "organizations_select_member" on public.organizations;
create policy "organizations_select_member" on public.organizations
for select using (public.is_workspace_member(workspace_id));
drop policy if exists "organizations_insert_member" on public.organizations;
create policy "organizations_insert_member" on public.organizations
for insert with check (public.is_workspace_member(workspace_id));
drop policy if exists "organizations_update_member" on public.organizations;
create policy "organizations_update_member" on public.organizations
for update using (public.is_workspace_member(workspace_id));

drop policy if exists "people_select_member" on public.people;
create policy "people_select_member" on public.people
for select using (public.is_workspace_member(workspace_id));
drop policy if exists "people_insert_member" on public.people;
create policy "people_insert_member" on public.people
for insert with check (public.is_workspace_member(workspace_id));
drop policy if exists "people_update_member" on public.people;
create policy "people_update_member" on public.people
for update using (public.is_workspace_member(workspace_id));

drop policy if exists "identity_aliases_select_member" on public.identity_aliases;
create policy "identity_aliases_select_member" on public.identity_aliases
for select using (public.is_workspace_member(workspace_id));
drop policy if exists "identity_aliases_insert_member" on public.identity_aliases;
create policy "identity_aliases_insert_member" on public.identity_aliases
for insert with check (public.is_workspace_member(workspace_id));

drop policy if exists "conversations_select_member" on public.conversations;
create policy "conversations_select_member" on public.conversations
for select using (public.is_workspace_member(workspace_id));
drop policy if exists "conversations_insert_member" on public.conversations;
create policy "conversations_insert_member" on public.conversations
for insert with check (public.is_workspace_member(workspace_id));
drop policy if exists "conversations_update_member" on public.conversations;
create policy "conversations_update_member" on public.conversations
for update using (public.is_workspace_member(workspace_id));

drop policy if exists "messages_select_member" on public.messages;
create policy "messages_select_member" on public.messages
for select using (public.is_workspace_member(workspace_id));
drop policy if exists "messages_insert_member" on public.messages;
create policy "messages_insert_member" on public.messages
for insert with check (public.is_workspace_member(workspace_id));
drop policy if exists "messages_update_member" on public.messages;
create policy "messages_update_member" on public.messages
for update using (public.is_workspace_member(workspace_id));

drop policy if exists "meetings_select_member" on public.meetings;
create policy "meetings_select_member" on public.meetings
for select using (public.is_workspace_member(workspace_id));
drop policy if exists "meetings_insert_member" on public.meetings;
create policy "meetings_insert_member" on public.meetings
for insert with check (public.is_workspace_member(workspace_id));
drop policy if exists "meetings_update_member" on public.meetings;
create policy "meetings_update_member" on public.meetings
for update using (public.is_workspace_member(workspace_id));

drop policy if exists "deals_select_member" on public.deals;
create policy "deals_select_member" on public.deals
for select using (public.is_workspace_member(workspace_id));
drop policy if exists "deals_insert_member" on public.deals;
create policy "deals_insert_member" on public.deals
for insert with check (public.is_workspace_member(workspace_id));
drop policy if exists "deals_update_member" on public.deals;
create policy "deals_update_member" on public.deals
for update using (public.is_workspace_member(workspace_id));

drop policy if exists "tickets_select_member" on public.tickets;
create policy "tickets_select_member" on public.tickets
for select using (public.is_workspace_member(workspace_id));
drop policy if exists "tickets_insert_member" on public.tickets;
create policy "tickets_insert_member" on public.tickets
for insert with check (public.is_workspace_member(workspace_id));
drop policy if exists "tickets_update_member" on public.tickets;
create policy "tickets_update_member" on public.tickets
for update using (public.is_workspace_member(workspace_id));

drop policy if exists "tasks_select_member" on public.tasks;
create policy "tasks_select_member" on public.tasks
for select using (public.is_workspace_member(workspace_id));
drop policy if exists "tasks_insert_member" on public.tasks;
create policy "tasks_insert_member" on public.tasks
for insert with check (public.is_workspace_member(workspace_id));
drop policy if exists "tasks_update_member" on public.tasks;
create policy "tasks_update_member" on public.tasks
for update using (public.is_workspace_member(workspace_id));

drop policy if exists "documents_select_member" on public.documents;
create policy "documents_select_member" on public.documents
for select using (public.is_workspace_member(workspace_id));
drop policy if exists "documents_insert_member" on public.documents;
create policy "documents_insert_member" on public.documents
for insert with check (public.is_workspace_member(workspace_id));
drop policy if exists "documents_update_member" on public.documents;
create policy "documents_update_member" on public.documents
for update using (public.is_workspace_member(workspace_id));

drop policy if exists "timeline_events_select_member" on public.timeline_events;
create policy "timeline_events_select_member" on public.timeline_events
for select using (public.is_workspace_member(workspace_id));
drop policy if exists "timeline_events_insert_member" on public.timeline_events;
create policy "timeline_events_insert_member" on public.timeline_events
for insert with check (public.is_workspace_member(workspace_id));
drop policy if exists "timeline_events_update_member" on public.timeline_events;
create policy "timeline_events_update_member" on public.timeline_events
for update using (public.is_workspace_member(workspace_id));

drop policy if exists "action_executions_select_member" on public.action_executions;
create policy "action_executions_select_member" on public.action_executions
for select using (public.is_workspace_member(workspace_id));
drop policy if exists "action_executions_insert_member" on public.action_executions;
create policy "action_executions_insert_member" on public.action_executions
for insert with check (public.is_workspace_member(workspace_id));

drop policy if exists "search_index_entries_select_member" on public.search_index_entries;
create policy "search_index_entries_select_member" on public.search_index_entries
for select using (public.is_workspace_member(workspace_id));
drop policy if exists "search_index_entries_insert_member" on public.search_index_entries;
create policy "search_index_entries_insert_member" on public.search_index_entries
for insert with check (public.is_workspace_member(workspace_id));
drop policy if exists "search_index_entries_update_member" on public.search_index_entries;
create policy "search_index_entries_update_member" on public.search_index_entries
for update using (public.is_workspace_member(workspace_id));

drop policy if exists "embedding_chunks_select_member" on public.embedding_chunks;
create policy "embedding_chunks_select_member" on public.embedding_chunks
for select using (public.is_workspace_member(workspace_id));
drop policy if exists "embedding_chunks_insert_member" on public.embedding_chunks;
create policy "embedding_chunks_insert_member" on public.embedding_chunks
for insert with check (public.is_workspace_member(workspace_id));
drop policy if exists "embedding_chunks_update_member" on public.embedding_chunks;
create policy "embedding_chunks_update_member" on public.embedding_chunks
for update using (public.is_workspace_member(workspace_id));
