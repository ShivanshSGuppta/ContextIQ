alter table public.slack_integrations
  add column if not exists enterprise_id text,
  add column if not exists slack_user_id text,
  add column if not exists user_access_token_encrypted text,
  add column if not exists bot_access_token_encrypted text,
  add column if not exists user_token_type text,
  add column if not exists bot_token_type text,
  add column if not exists user_scopes text[] not null default '{}'::text[],
  add column if not exists bot_scopes text[] not null default '{}'::text[],
  add column if not exists needs_reconnect boolean not null default false;

-- Backward compatibility: migrate old bot token/scopes into new bot columns.
update public.slack_integrations
set
  bot_access_token_encrypted = coalesce(bot_access_token_encrypted, access_token_encrypted),
  bot_token_type = coalesce(bot_token_type, token_type),
  bot_scopes = case
    when coalesce(array_length(bot_scopes, 1), 0) = 0 then coalesce(scopes, '{}'::text[])
    else bot_scopes
  end,
  needs_reconnect = case
    when user_access_token_encrypted is null and coalesce(bot_access_token_encrypted, access_token_encrypted) is not null then true
    else needs_reconnect
  end;
