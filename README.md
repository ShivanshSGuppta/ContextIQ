# ContextIQ

ContextIQ is a memory-native workspace for sales and customer-facing teams. It combines structured account intelligence with contextual memory recall so teams can prepare for meetings, draft follow-ups, summarize blockers, and track what changed recently.

## Product Overview

ContextIQ is built around three layers:

- Supabase as the structured system of record for workspace, accounts, contacts, activities, notes, and generated history.
- HydraDB as the memory layer for ingestion and semantic recall.
- Gemini as the final generation layer that turns grounded context into user-facing outputs.

This architecture keeps retrieval and generation separate: memory recall provides evidence, then generation synthesizes only from that evidence.

## Core Experiences

- Private workspace mode with real Google-authenticated sessions.
- Walk-In Experience mode with seeded data for product demos.
- Account workspace as the main operating surface for prep, follow-up, and memory-backed actioning.
- Active Context rail that surfaces recalled memory cards with provenance and relevance reason.
- Recent Contexts sidebar for company-level navigation into account workspaces.

## Product Capabilities

- Account, contact, activity, and note flows with persistent state.
- Memory ingestion from product records and connected integration signals.
- Recall orchestration per account, optional selected contact, and action intent.
- Action-specific generation:
  - Prepare for meeting
  - Draft follow-up
  - Summarize blockers
  - What changed recently
- Traceability of generated outputs with persisted recalled-memories evidence.

## Integrations

- Gmail integration for signal ingestion and follow-up workflows.
- LinkedIn integration for contact-associated signal ingestion.
- Background sync model through scheduled jobs, with dedupe, telemetry, and action/event tracking.

## Data and Memory Model

- Structured entities are persisted in relational tables (profiles, workspaces, members, accounts, contacts, activities, notes, outputs).
- Memory units are ingested into HydraDB with scoped metadata (`workspace`, `account`, optional `contact`, source, topic, importance, stage, timestamps).
- Recall queries are account-aware and action-aware, then narrowed to selected-contact scope when applicable.

## UI/UX Positioning

- The visual shell is intentionally preserved from the original ContextIQ prototype.
- The implementation prioritizes backend realism and runtime reliability over UI redesign.
- Minimal UX adjustments are limited to loading, empty, success, and error states required for live operation.

## Repository Structure

- `app/` Next.js App Router surfaces and route handlers
- `components/` UI shell, workspace views, and forms
- `lib/supabase/` auth/session/admin clients and helpers
- `lib/hydradb/` ingestion and recall client logic
- `lib/gemini/` generation client and orchestration
- `lib/prompts/` action-specific prompt templates
- `lib/validators/` request and payload validation
- `types/` shared product and contract types
- `scripts/` deterministic seed and utility scripts
- `supabase/migrations/` schema and integration migrations

## Security and Governance

- Row-level access boundaries are workspace-scoped.
- Integration credentials are handled server-side and never exposed client-side.
- Integration actions and sync runs are auditable via persisted ledgers/events.

## License

This project is licensed under the **GNU Affero General Public License v3.0**.  
See [LICENSE](./LICENSE).
