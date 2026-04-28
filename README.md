# ContextIQ

ContextIQ is a memory-native workspace for customer-facing teams.  
This repo preserves the original UI shell and adds production backend behavior with Supabase, HydraDB, and Gemini.

## Core Capabilities

- Google-authenticated private workspace
- Walk-in seeded demo workspace
- Live account/contact/activity/note persistence in Supabase
- HydraDB ingestion and contextual recall
- Gemini-generated outputs for:
  - Prepare for meeting
  - Draft follow-up
  - Summarize blockers
  - What changed recently
- Gmail + LinkedIn ingestion pipelines with scheduled sync

## Tech Stack

- Next.js App Router + TypeScript + Tailwind CSS
- Supabase (Auth, Postgres, RLS)
- HydraDB (memory ingestion/recall)
- Gemini API (final generation layer)
- Vercel (hosting + cron)

## License

This project is licensed under **Business Source License 1.1** (not MIT).  
See [LICENSE](./LICENSE).

## Quick Start (Local)

1. Install dependencies:

```bash
npm install
```

2. Copy env template:

```bash
cp .env.example .env.local
```

3. Fill all required values in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

HYDRADB_API_KEY=
HYDRADB_BASE_URL=https://api.hydradb.com

GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash

APP_BASE_URL=http://localhost:3000

INTEGRATION_TOKEN_SECRET=
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
CRON_SYNC_SECRET=
CRON_SECRET=
```

4. Start dev server:

```bash
npm run dev
```

5. Open:
- `http://localhost:3000` (landing)
- `http://localhost:3000/auth/sign-in` (real auth)
- `http://localhost:3000/walk-in/enter` (seeded demo)

## Supabase Setup

Apply migrations in this order:

1. [supabase/migrations/20260425_contextiq_init.sql](./supabase/migrations/20260425_contextiq_init.sql)
2. [supabase/migrations/20260427_gmail_integrations.sql](./supabase/migrations/20260427_gmail_integrations.sql)
3. [supabase/migrations/20260427_linkedin_integrations.sql](./supabase/migrations/20260427_linkedin_integrations.sql)
4. [supabase/migrations/20260427_integration_action_events.sql](./supabase/migrations/20260427_integration_action_events.sql)

Then configure auth:

- Site URL: `http://localhost:3000` (local), production domain on deploy
- Redirect URL: `/auth/callback`
- Enable Google provider with proper OAuth credentials

## Integrations

### Gmail

- Connect from workspace header
- Scopes: `gmail.readonly`, `gmail.send`, `gmail.compose`
- Sync imports signals from inbox/archived/starred into notes/activities
- Records are ingested into HydraDB for recall

### LinkedIn

- Connect from workspace header
- Sync ingests contact-linked signals (based on `linkedin_url`)
- Signals persist to Supabase and ingest to HydraDB

## Seeding Demo Data

After first login, run:

```bash
npm run seed:demo
```

Optional targeted seed:

```bash
SEED_USER_EMAIL=you@example.com npm run seed:demo
```

## Production Go-Live

Use the full runbook:

- [docs/GO_LIVE_RUNBOOK.md](./docs/GO_LIVE_RUNBOOK.md)

It covers:

- Supabase project + migrations
- Google + LinkedIn OAuth configuration
- Vercel env variables
- cron setup and secret handling
- post-deploy checks and security verification

## Deployment Notes

- Deploy on Vercel with default Next.js settings
- Keep all server keys private:
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `HYDRADB_API_KEY`
  - `GEMINI_API_KEY`
  - OAuth client secrets
  - cron and integration secrets
- Set `APP_BASE_URL` to your production domain
- Ensure Supabase and OAuth redirect URLs exactly match production URLs
