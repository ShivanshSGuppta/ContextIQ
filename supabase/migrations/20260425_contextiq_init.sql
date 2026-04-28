create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  slug text unique,
  description text,
  hydradb_tenant_id text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create or replace function public.is_workspace_member(workspace_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspaces w
    left join public.workspace_members wm
      on wm.workspace_id = w.id
     and wm.user_id = auth.uid()
    where w.id = workspace_uuid
      and (w.owner_id = auth.uid() or wm.user_id is not null)
  );
$$;

create or replace function public.is_workspace_owner(workspace_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspaces
    where id = workspace_uuid and owner_id = auth.uid()
  );
$$;

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  domain text,
  industry text,
  stage text not null default 'prospect' check (
    stage in ('prospect', 'discovery', 'evaluation', 'negotiation', 'customer', 'at_risk', 'closed_won', 'closed_lost')
  ),
  priority text not null default 'medium' check (
    priority in ('low', 'medium', 'high', 'critical')
  ),
  arr_estimate numeric(12,2),
  owner_name text,
  notes_summary text,
  last_contacted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  name text not null,
  email text,
  title text,
  role_type text check (
    role_type in ('champion', 'economic_buyer', 'technical_buyer', 'procurement', 'end_user', 'decision_maker', 'other')
  ),
  communication_style text,
  preference_summary text,
  importance_level text not null default 'medium' check (
    importance_level in ('low', 'medium', 'high', 'critical')
  ),
  linkedin_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  title text,
  content text not null,
  source_type text not null check (
    source_type in ('manual_note', 'meeting_note', 'call_summary', 'email_summary', 'transcript', 'uploaded_document', 'crm_import')
  ),
  topic text,
  importance_level text default 'medium' check (
    importance_level in ('low', 'medium', 'high', 'critical')
  ),
  hydradb_memory_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  actor_id uuid references public.profiles(id) on delete set null,
  activity_type text not null check (
    activity_type in ('email_sent', 'email_received', 'call_logged', 'meeting_logged', 'note_added', 'status_changed', 'task_created', 'document_uploaded')
  ),
  title text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  hydradb_memory_id text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.generated_outputs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  action_type text not null check (
    action_type in ('prepare_meeting', 'draft_followup', 'summarize_blockers', 'what_changed_recently')
  ),
  prompt text,
  output_text text not null,
  recalled_memories_json jsonb not null default '[]'::jsonb,
  model_name text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_workspaces_owner_id on public.workspaces(owner_id);
create index if not exists idx_workspace_members_workspace_id on public.workspace_members(workspace_id);
create index if not exists idx_workspace_members_user_id on public.workspace_members(user_id);
create index if not exists idx_accounts_workspace_id on public.accounts(workspace_id);
create index if not exists idx_accounts_stage on public.accounts(stage);
create index if not exists idx_accounts_priority on public.accounts(priority);
create index if not exists idx_contacts_workspace_id on public.contacts(workspace_id);
create index if not exists idx_contacts_account_id on public.contacts(account_id);
create index if not exists idx_notes_workspace_id on public.notes(workspace_id);
create index if not exists idx_notes_account_id on public.notes(account_id);
create index if not exists idx_notes_contact_id on public.notes(contact_id);
create index if not exists idx_notes_source_type on public.notes(source_type);
create index if not exists idx_notes_created_at on public.notes(created_at desc);
create index if not exists idx_activities_workspace_id on public.activities(workspace_id);
create index if not exists idx_activities_account_id on public.activities(account_id);
create index if not exists idx_activities_occurred_at on public.activities(occurred_at desc);
create index if not exists idx_generated_outputs_workspace_id on public.generated_outputs(workspace_id);
create index if not exists idx_generated_outputs_account_id on public.generated_outputs(account_id);
create index if not exists idx_generated_outputs_action_type on public.generated_outputs(action_type);
create index if not exists idx_generated_outputs_created_at on public.generated_outputs(created_at desc);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_workspaces_updated_at on public.workspaces;
create trigger set_workspaces_updated_at
before update on public.workspaces
for each row execute function public.set_updated_at();

drop trigger if exists set_accounts_updated_at on public.accounts;
create trigger set_accounts_updated_at
before update on public.accounts
for each row execute function public.set_updated_at();

drop trigger if exists set_contacts_updated_at on public.contacts;
create trigger set_contacts_updated_at
before update on public.contacts
for each row execute function public.set_updated_at();

drop trigger if exists set_notes_updated_at on public.notes;
create trigger set_notes_updated_at
before update on public.notes
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.accounts enable row level security;
alter table public.contacts enable row level security;
alter table public.notes enable row level security;
alter table public.activities enable row level security;
alter table public.generated_outputs enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id);

drop policy if exists "workspaces_select_member" on public.workspaces;
create policy "workspaces_select_member" on public.workspaces
for select using (public.is_workspace_member(id));

drop policy if exists "workspaces_insert_owner" on public.workspaces;
create policy "workspaces_insert_owner" on public.workspaces
for insert with check (owner_id = auth.uid());

drop policy if exists "workspaces_update_owner" on public.workspaces;
create policy "workspaces_update_owner" on public.workspaces
for update using (public.is_workspace_owner(id));

drop policy if exists "workspace_members_select_member" on public.workspace_members;
create policy "workspace_members_select_member" on public.workspace_members
for select using (public.is_workspace_member(workspace_id));

drop policy if exists "workspace_members_insert_owner" on public.workspace_members;
create policy "workspace_members_insert_owner" on public.workspace_members
for insert with check (public.is_workspace_owner(workspace_id));

drop policy if exists "workspace_members_update_owner" on public.workspace_members;
create policy "workspace_members_update_owner" on public.workspace_members
for update using (public.is_workspace_owner(workspace_id));

drop policy if exists "accounts_select_member" on public.accounts;
create policy "accounts_select_member" on public.accounts
for select using (public.is_workspace_member(workspace_id));

drop policy if exists "accounts_insert_member" on public.accounts;
create policy "accounts_insert_member" on public.accounts
for insert with check (public.is_workspace_member(workspace_id));

drop policy if exists "accounts_update_member" on public.accounts;
create policy "accounts_update_member" on public.accounts
for update using (public.is_workspace_member(workspace_id));

drop policy if exists "accounts_delete_member" on public.accounts;
create policy "accounts_delete_member" on public.accounts
for delete using (public.is_workspace_member(workspace_id));

drop policy if exists "contacts_select_member" on public.contacts;
create policy "contacts_select_member" on public.contacts
for select using (public.is_workspace_member(workspace_id));

drop policy if exists "contacts_insert_member" on public.contacts;
create policy "contacts_insert_member" on public.contacts
for insert with check (public.is_workspace_member(workspace_id));

drop policy if exists "contacts_update_member" on public.contacts;
create policy "contacts_update_member" on public.contacts
for update using (public.is_workspace_member(workspace_id));

drop policy if exists "contacts_delete_member" on public.contacts;
create policy "contacts_delete_member" on public.contacts
for delete using (public.is_workspace_member(workspace_id));

drop policy if exists "notes_select_member" on public.notes;
create policy "notes_select_member" on public.notes
for select using (public.is_workspace_member(workspace_id));

drop policy if exists "notes_insert_member" on public.notes;
create policy "notes_insert_member" on public.notes
for insert with check (public.is_workspace_member(workspace_id));

drop policy if exists "notes_update_member" on public.notes;
create policy "notes_update_member" on public.notes
for update using (public.is_workspace_member(workspace_id));

drop policy if exists "notes_delete_member" on public.notes;
create policy "notes_delete_member" on public.notes
for delete using (public.is_workspace_member(workspace_id));

drop policy if exists "activities_select_member" on public.activities;
create policy "activities_select_member" on public.activities
for select using (public.is_workspace_member(workspace_id));

drop policy if exists "activities_insert_member" on public.activities;
create policy "activities_insert_member" on public.activities
for insert with check (public.is_workspace_member(workspace_id));

drop policy if exists "activities_update_member" on public.activities;
create policy "activities_update_member" on public.activities
for update using (public.is_workspace_member(workspace_id));

drop policy if exists "activities_delete_member" on public.activities;
create policy "activities_delete_member" on public.activities
for delete using (public.is_workspace_member(workspace_id));

drop policy if exists "generated_outputs_select_member" on public.generated_outputs;
create policy "generated_outputs_select_member" on public.generated_outputs
for select using (public.is_workspace_member(workspace_id));

drop policy if exists "generated_outputs_insert_member" on public.generated_outputs;
create policy "generated_outputs_insert_member" on public.generated_outputs
for insert with check (public.is_workspace_member(workspace_id));

drop policy if exists "generated_outputs_update_member" on public.generated_outputs;
create policy "generated_outputs_update_member" on public.generated_outputs
for update using (public.is_workspace_member(workspace_id));

drop policy if exists "generated_outputs_delete_member" on public.generated_outputs;
create policy "generated_outputs_delete_member" on public.generated_outputs
for delete using (public.is_workspace_member(workspace_id));