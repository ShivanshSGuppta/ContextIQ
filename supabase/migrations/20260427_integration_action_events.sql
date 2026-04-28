create table if not exists public.integration_action_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  action_key text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_integration_action_events_workspace_user_key_created
  on public.integration_action_events(workspace_id, user_id, action_key, created_at desc);

alter table public.integration_action_events enable row level security;

drop policy if exists "integration_action_events_select_member" on public.integration_action_events;
create policy "integration_action_events_select_member" on public.integration_action_events
  for select using (public.is_workspace_member(workspace_id));
drop policy if exists "integration_action_events_insert_self" on public.integration_action_events;
create policy "integration_action_events_insert_self" on public.integration_action_events
  for insert with check (public.is_workspace_member(workspace_id) and user_id = auth.uid());
