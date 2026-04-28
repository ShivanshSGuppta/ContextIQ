create table if not exists public.gmail_integrations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null default 'google',
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

create table if not exists public.gmail_message_syncs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  gmail_message_id text not null,
  gmail_thread_id text,
  account_id uuid references public.accounts(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  activity_id uuid references public.activities(id) on delete set null,
  note_id uuid references public.notes(id) on delete set null,
  synced_at timestamptz not null default now(),
  unique (workspace_id, user_id, gmail_message_id)
);

create index if not exists idx_gmail_integrations_workspace_user
  on public.gmail_integrations(workspace_id, user_id);
create index if not exists idx_gmail_integrations_last_synced_at
  on public.gmail_integrations(last_synced_at desc);
create index if not exists idx_gmail_message_syncs_workspace_user
  on public.gmail_message_syncs(workspace_id, user_id);
create index if not exists idx_gmail_message_syncs_account
  on public.gmail_message_syncs(account_id);

drop trigger if exists set_gmail_integrations_updated_at on public.gmail_integrations;
create trigger set_gmail_integrations_updated_at
before update on public.gmail_integrations
for each row execute function public.set_updated_at();

alter table public.gmail_integrations enable row level security;
alter table public.gmail_message_syncs enable row level security;

drop policy if exists "gmail_integrations_select_member" on public.gmail_integrations;
create policy "gmail_integrations_select_member" on public.gmail_integrations
  for select using (public.is_workspace_member(workspace_id));
drop policy if exists "gmail_integrations_insert_self" on public.gmail_integrations;
create policy "gmail_integrations_insert_self" on public.gmail_integrations
  for insert with check (public.is_workspace_member(workspace_id) and user_id = auth.uid());
drop policy if exists "gmail_integrations_update_self" on public.gmail_integrations;
create policy "gmail_integrations_update_self" on public.gmail_integrations
  for update using (public.is_workspace_member(workspace_id) and user_id = auth.uid());
drop policy if exists "gmail_integrations_delete_self" on public.gmail_integrations;
create policy "gmail_integrations_delete_self" on public.gmail_integrations
  for delete using (public.is_workspace_member(workspace_id) and user_id = auth.uid());

drop policy if exists "gmail_message_syncs_select_member" on public.gmail_message_syncs;
create policy "gmail_message_syncs_select_member" on public.gmail_message_syncs
  for select using (public.is_workspace_member(workspace_id));
drop policy if exists "gmail_message_syncs_insert_self" on public.gmail_message_syncs;
create policy "gmail_message_syncs_insert_self" on public.gmail_message_syncs
  for insert with check (public.is_workspace_member(workspace_id) and user_id = auth.uid());
drop policy if exists "gmail_message_syncs_update_self" on public.gmail_message_syncs;
create policy "gmail_message_syncs_update_self" on public.gmail_message_syncs
  for update using (public.is_workspace_member(workspace_id) and user_id = auth.uid());
drop policy if exists "gmail_message_syncs_delete_self" on public.gmail_message_syncs;
create policy "gmail_message_syncs_delete_self" on public.gmail_message_syncs
  for delete using (public.is_workspace_member(workspace_id) and user_id = auth.uid());
