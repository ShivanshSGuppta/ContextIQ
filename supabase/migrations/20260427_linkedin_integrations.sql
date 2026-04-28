create table if not exists public.linkedin_integrations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null default 'linkedin',
  linkedin_sub text,
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

create table if not exists public.linkedin_profile_syncs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  contact_id uuid not null references public.contacts(id) on delete cascade,
  source_url text not null,
  content_hash text not null,
  note_id uuid references public.notes(id) on delete set null,
  activity_id uuid references public.activities(id) on delete set null,
  synced_at timestamptz not null default now(),
  unique (workspace_id, contact_id, content_hash)
);

create index if not exists idx_linkedin_integrations_workspace_user
  on public.linkedin_integrations(workspace_id, user_id);
create index if not exists idx_linkedin_profile_syncs_workspace_user
  on public.linkedin_profile_syncs(workspace_id, user_id);
create index if not exists idx_linkedin_profile_syncs_contact
  on public.linkedin_profile_syncs(contact_id, synced_at desc);

drop trigger if exists set_linkedin_integrations_updated_at on public.linkedin_integrations;
create trigger set_linkedin_integrations_updated_at
before update on public.linkedin_integrations
for each row execute function public.set_updated_at();

alter table public.linkedin_integrations enable row level security;
alter table public.linkedin_profile_syncs enable row level security;

drop policy if exists "linkedin_integrations_select_member" on public.linkedin_integrations;
create policy "linkedin_integrations_select_member" on public.linkedin_integrations
  for select using (public.is_workspace_member(workspace_id));
drop policy if exists "linkedin_integrations_insert_self" on public.linkedin_integrations;
create policy "linkedin_integrations_insert_self" on public.linkedin_integrations
  for insert with check (public.is_workspace_member(workspace_id) and user_id = auth.uid());
drop policy if exists "linkedin_integrations_update_self" on public.linkedin_integrations;
create policy "linkedin_integrations_update_self" on public.linkedin_integrations
  for update using (public.is_workspace_member(workspace_id) and user_id = auth.uid());
drop policy if exists "linkedin_integrations_delete_self" on public.linkedin_integrations;
create policy "linkedin_integrations_delete_self" on public.linkedin_integrations
  for delete using (public.is_workspace_member(workspace_id) and user_id = auth.uid());

drop policy if exists "linkedin_profile_syncs_select_member" on public.linkedin_profile_syncs;
create policy "linkedin_profile_syncs_select_member" on public.linkedin_profile_syncs
  for select using (public.is_workspace_member(workspace_id));
drop policy if exists "linkedin_profile_syncs_insert_self" on public.linkedin_profile_syncs;
create policy "linkedin_profile_syncs_insert_self" on public.linkedin_profile_syncs
  for insert with check (public.is_workspace_member(workspace_id) and user_id = auth.uid());
drop policy if exists "linkedin_profile_syncs_update_self" on public.linkedin_profile_syncs;
create policy "linkedin_profile_syncs_update_self" on public.linkedin_profile_syncs
  for update using (public.is_workspace_member(workspace_id) and user_id = auth.uid());
drop policy if exists "linkedin_profile_syncs_delete_self" on public.linkedin_profile_syncs;
create policy "linkedin_profile_syncs_delete_self" on public.linkedin_profile_syncs
  for delete using (public.is_workspace_member(workspace_id) and user_id = auth.uid());
