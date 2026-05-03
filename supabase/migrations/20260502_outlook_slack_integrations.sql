create table if not exists public.outlook_integrations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null default 'outlook',
  email text,
  access_token_encrypted text not null,
  refresh_token_encrypted text,
  token_type text,
  scopes text[] not null default '{}'::text[],
  expires_at timestamptz,
  connected_at timestamptz not null default now(),
  last_synced_at timestamptz,
  sync_status text not null default 'idle' check (sync_status in ('idle', 'syncing', 'ok', 'error')),
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, user_id, provider)
);

create table if not exists public.outlook_message_syncs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  outlook_message_id text not null,
  outlook_thread_id text,
  account_id uuid references public.accounts(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  activity_id uuid references public.activities(id) on delete set null,
  note_id uuid references public.notes(id) on delete set null,
  synced_at timestamptz not null default now(),
  unique (workspace_id, user_id, outlook_message_id)
);

create table if not exists public.slack_integrations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null default 'slack',
  email text,
  team_id text,
  team_name text,
  access_token_encrypted text not null,
  token_type text,
  scopes text[] not null default '{}'::text[],
  connected_at timestamptz not null default now(),
  last_synced_at timestamptz,
  sync_status text not null default 'idle' check (sync_status in ('idle', 'syncing', 'ok', 'error')),
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, user_id, provider)
);

create table if not exists public.slack_message_syncs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  slack_channel_id text not null,
  slack_channel_name text,
  slack_message_ts text not null,
  account_id uuid references public.accounts(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  activity_id uuid references public.activities(id) on delete set null,
  note_id uuid references public.notes(id) on delete set null,
  synced_at timestamptz not null default now(),
  unique (workspace_id, user_id, slack_channel_id, slack_message_ts)
);

create index if not exists idx_outlook_integrations_workspace_user
  on public.outlook_integrations(workspace_id, user_id);
create index if not exists idx_outlook_message_syncs_workspace_user
  on public.outlook_message_syncs(workspace_id, user_id);
create index if not exists idx_slack_integrations_workspace_user
  on public.slack_integrations(workspace_id, user_id);
create index if not exists idx_slack_message_syncs_workspace_user
  on public.slack_message_syncs(workspace_id, user_id);

alter table public.outlook_integrations enable row level security;
alter table public.outlook_message_syncs enable row level security;
alter table public.slack_integrations enable row level security;
alter table public.slack_message_syncs enable row level security;

drop trigger if exists set_outlook_integrations_updated_at on public.outlook_integrations;
create trigger set_outlook_integrations_updated_at
before update on public.outlook_integrations
for each row execute function public.set_updated_at();

drop trigger if exists set_slack_integrations_updated_at on public.slack_integrations;
create trigger set_slack_integrations_updated_at
before update on public.slack_integrations
for each row execute function public.set_updated_at();

drop policy if exists "outlook_integrations_select_member" on public.outlook_integrations;
create policy "outlook_integrations_select_member" on public.outlook_integrations
  for select using (public.is_workspace_member(workspace_id));
drop policy if exists "outlook_integrations_insert_self" on public.outlook_integrations;
create policy "outlook_integrations_insert_self" on public.outlook_integrations
  for insert with check (public.is_workspace_member(workspace_id) and user_id = auth.uid());
drop policy if exists "outlook_integrations_update_self" on public.outlook_integrations;
create policy "outlook_integrations_update_self" on public.outlook_integrations
  for update using (public.is_workspace_member(workspace_id) and user_id = auth.uid());
drop policy if exists "outlook_integrations_delete_self" on public.outlook_integrations;
create policy "outlook_integrations_delete_self" on public.outlook_integrations
  for delete using (public.is_workspace_member(workspace_id) and user_id = auth.uid());

drop policy if exists "outlook_message_syncs_select_member" on public.outlook_message_syncs;
create policy "outlook_message_syncs_select_member" on public.outlook_message_syncs
  for select using (public.is_workspace_member(workspace_id));
drop policy if exists "outlook_message_syncs_insert_self" on public.outlook_message_syncs;
create policy "outlook_message_syncs_insert_self" on public.outlook_message_syncs
  for insert with check (public.is_workspace_member(workspace_id) and user_id = auth.uid());
drop policy if exists "outlook_message_syncs_update_self" on public.outlook_message_syncs;
create policy "outlook_message_syncs_update_self" on public.outlook_message_syncs
  for update using (public.is_workspace_member(workspace_id) and user_id = auth.uid());
drop policy if exists "outlook_message_syncs_delete_self" on public.outlook_message_syncs;
create policy "outlook_message_syncs_delete_self" on public.outlook_message_syncs
  for delete using (public.is_workspace_member(workspace_id) and user_id = auth.uid());

drop policy if exists "slack_integrations_select_member" on public.slack_integrations;
create policy "slack_integrations_select_member" on public.slack_integrations
  for select using (public.is_workspace_member(workspace_id));
drop policy if exists "slack_integrations_insert_self" on public.slack_integrations;
create policy "slack_integrations_insert_self" on public.slack_integrations
  for insert with check (public.is_workspace_member(workspace_id) and user_id = auth.uid());
drop policy if exists "slack_integrations_update_self" on public.slack_integrations;
create policy "slack_integrations_update_self" on public.slack_integrations
  for update using (public.is_workspace_member(workspace_id) and user_id = auth.uid());
drop policy if exists "slack_integrations_delete_self" on public.slack_integrations;
create policy "slack_integrations_delete_self" on public.slack_integrations
  for delete using (public.is_workspace_member(workspace_id) and user_id = auth.uid());

drop policy if exists "slack_message_syncs_select_member" on public.slack_message_syncs;
create policy "slack_message_syncs_select_member" on public.slack_message_syncs
  for select using (public.is_workspace_member(workspace_id));
drop policy if exists "slack_message_syncs_insert_self" on public.slack_message_syncs;
create policy "slack_message_syncs_insert_self" on public.slack_message_syncs
  for insert with check (public.is_workspace_member(workspace_id) and user_id = auth.uid());
drop policy if exists "slack_message_syncs_update_self" on public.slack_message_syncs;
create policy "slack_message_syncs_update_self" on public.slack_message_syncs
  for update using (public.is_workspace_member(workspace_id) and user_id = auth.uid());
drop policy if exists "slack_message_syncs_delete_self" on public.slack_message_syncs;
create policy "slack_message_syncs_delete_self" on public.slack_message_syncs
  for delete using (public.is_workspace_member(workspace_id) and user_id = auth.uid());
