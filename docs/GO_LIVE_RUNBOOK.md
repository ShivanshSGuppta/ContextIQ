# ContextIQ Go-Live Runbook (Env -> Deployment)

Use this exact order per environment:
1. Supabase project + migrations
2. OAuth providers (Google + LinkedIn)
3. Vercel project + env vars
4. Deploy
5. Post-deploy verification

## 1) Create Supabase project

Create a new Supabase project, then copy from `Project Settings -> API`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 2) Apply SQL migrations (order matters)

Run these files in Supabase SQL editor, in this order:
1. `/Users/ssg/Desktop/ContextIQ/supabase/migrations/20260425_contextiq_init.sql`
2. `/Users/ssg/Desktop/ContextIQ/supabase/migrations/20260427_gmail_integrations.sql`
3. `/Users/ssg/Desktop/ContextIQ/supabase/migrations/20260427_linkedin_integrations.sql`
4. `/Users/ssg/Desktop/ContextIQ/supabase/migrations/20260427_integration_action_events.sql`

## 3) Configure Supabase Auth URLs

In `Authentication -> URL Configuration`:
- `Site URL = https://<your-prod-domain>`
- Add redirect URL: `https://<your-prod-domain>/auth/callback`

## 4) Configure Google OAuth (login + Gmail scopes)

In Google Cloud:
- Create OAuth app (Web).
- Add authorized redirect URI:
  - `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`

In Supabase `Authentication -> Providers -> Google`:
- Enable Google provider.
- Paste Google Client ID/Secret.

Google app must be published (or correct test users added) for your target users.

## 5) Configure LinkedIn OAuth

In LinkedIn Developer app:
- Enable Sign In with LinkedIn (OIDC).
- Add redirect URL:
  - `https://<your-prod-domain>/auth/linkedin/callback`
- Copy LinkedIn Client ID and Client Secret.

## 6) Create Vercel project

- Import repository into Vercel.
- Keep default Next.js build settings.
- Attach production domain (or use Vercel domain).

## 7) Set Vercel environment variables

Set all of these in Vercel (Production, and Preview if needed):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `HYDRADB_API_KEY`
- `HYDRADB_BASE_URL`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `APP_BASE_URL=https://<your-prod-domain>`
- `INTEGRATION_TOKEN_SECRET=<long-random-secret>`
- `GOOGLE_OAUTH_CLIENT_ID=<google-client-id>`
- `GOOGLE_OAUTH_CLIENT_SECRET=<google-client-secret>`
- `LINKEDIN_CLIENT_ID=<linkedin-client-id>`
- `LINKEDIN_CLIENT_SECRET=<linkedin-client-secret>`
- `CRON_SYNC_SECRET=<long-random-secret>`

Important for Vercel cron auth:
- Also set `CRON_SECRET` to the same value as `CRON_SYNC_SECRET`.

## 8) Cron schedules

This repo already defines cron schedules in `/Users/ssg/Desktop/ContextIQ/vercel.json`:
- `/api/cron/sync-integrations` daily at 02:00 UTC

Deploying with this file registers cron jobs.

## 9) Deploy

- Trigger production deployment in Vercel.
- Confirm build succeeds.

## 10) Post-deploy functional checks

1. Open `https://<your-prod-domain>`.
2. Sign in via Google at `/auth/sign-in`.
3. Confirm workspace bootstrap and `/overview` load.
4. Click `Connect Gmail` and complete consent.
5. Click `Connect LinkedIn` and complete consent.
6. Trigger `Sync` for Gmail and LinkedIn.
7. Verify:
   - New `activities` and `notes` appear.
   - Hydra-backed memories appear in right rail and output traces.
   - Composer actions still work.
8. Manually call cron endpoints once with bearer token and confirm `200`:
   - `/api/cron/sync-integrations`
   - `/api/cron/sync-gmail`
   - `/api/cron/sync-linkedin`

Example manual cron check:

```bash
curl -i -H "Authorization: Bearer <CRON_SYNC_SECRET>" \
  https://<your-prod-domain>/api/cron/sync-integrations
```

```bash
curl -i -H "Authorization: Bearer <CRON_SYNC_SECRET>" \
  https://<your-prod-domain>/api/cron/sync-gmail
```

```bash
curl -i -H "Authorization: Bearer <CRON_SYNC_SECRET>" \
  https://<your-prod-domain>/api/cron/sync-linkedin
```

## 11) Production sanity/security checks

- Confirm no secrets are exposed client-side.
- Confirm RLS blocks cross-workspace access.
- Confirm integration token fields are encrypted values, not plaintext.

## Operational Interfaces

- Auth callback: `/auth/callback`
- LinkedIn connect routes:
  - `/auth/linkedin/start`
  - `/auth/linkedin/callback`
- Cron routes:
  - `/api/cron/sync-integrations`
  - `/api/cron/sync-gmail`
  - `/api/cron/sync-linkedin`

## Acceptance Checklist

- Google login works in production.
- Gmail + LinkedIn connect works.
- Integration sync writes to Supabase and Hydra-backed recall surfaces.
- Cron runs succeed with auth.
- After one-time migrations + OAuth provider setup + cron config, rollout is env + deploy.
