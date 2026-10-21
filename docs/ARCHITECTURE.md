# Architecture

The Daily Arcana is a single Next.js 15 (App Router) application written in TypeScript, styled with Tailwind CSS v4, and backed by Supabase (PostgreSQL + Auth). It deploys to Vercel as-is.

```
Browser ──► Next.js pages (React Server Components + client islands)
   │            │
   │            ├── /api/* route handlers (validation with zod, auth via Supabase session cookie)
   │            │        ├── Supabase Postgres (row-level security on every private table)
   │            │        └── AI provider (Anthropic) — server only, optional
   │            └── static content: 78-card library, academy lessons, art registry
   └── localStorage (guest mode only)
```

## Key ideas

1. **One canonical card ID everywhere.** The format is `major-00-the-fool` or `cups-03-three`. It is used by the content library, the database (`tarot_cards.id`, `reading_cards.card_id`), the art pipeline (`art/source/<id>.png`), URLs (`/deck/<id>`) and saved readings. See `src/lib/tarot/ids.ts` and `CARD_ID_PATTERN`.
2. **Reference content lives in code, not the database.** `src/content/cards/*` and `src/content/academy/*` are typed and validated by tests (`validateDeck`). The database copy in `tarot_cards` / `learning_*` is generated from code by `npm run db:seed:generate`, so they cannot drift. Content is versioned (`CARD_CONTENT_VERSION`).
3. **Randomness is independent of everything else.** `src/lib/tarot/draw.ts` uses Web Crypto with rejection sampling and Fisher–Yates. The question, category and AI never influence the draw. For accounts the draw happens on the server; for guests it happens in the browser.
4. **Interpretations are layered and saved as snapshots.**
   - `src/lib/interpret/reference.ts` builds a complete interpretation from the card library alone (it works offline and needs no AI).
   - `src/lib/ai/*` optionally asks an AI provider, grounded only in the drawn cards' library entries. The output is validated with zod *and* must match exactly the drawn cards, positions and orientations, otherwise it is rejected.
   - Every interpretation is stored immutably in `interpretation_snapshots` (accounts) or the guest store, so model or content changes never rewrite history.
5. **Two storage modes behind one interface.** `src/lib/readings/client.ts` exposes the same API for guests (`guest-store.ts`, this browser's localStorage) and accounts (`/api/readings/*`). UI components don't care which one is in use; `SessionProvider` tells them.
6. **Security is enforced by the database.** Every private table has RLS policies limiting rows to `auth.uid()`. Column-level grants make drawn cards, dates and snapshots immutable, and a partial unique index guarantees one daily card per user per local date. AI quotas are stored in `private.settings`, which users cannot modify. `supabase/tests/rls.test.ts` proves all of this against real PostgreSQL with two users.

## Directory map

| Path | What it holds |
| --- | --- |
| `src/app/` | Routes: pages and `/api/*` handlers |
| `src/components/` | UI: `cards/` (TarotCard, CardBack), `daily/`, `reading/`, `learning/`, `journal/`, `settings/`, `auth/`, `ornament/`, `layout/`, `session/` |
| `src/content/cards/` | The 78-card knowledge base |
| `src/content/academy/` | Courses and lessons |
| `src/lib/tarot/` | Types, IDs, draw, spreads, validation |
| `src/lib/interpret/` | Interpretation schema and reference interpreter |
| `src/lib/ai/` | Provider abstraction, grounding prompt, Anthropic implementation, quotas |
| `src/lib/readings/` | Reading types, shared planner, guest store, server repository, client API |
| `src/lib/learning/`, `src/lib/academy/` | Progress storage, card quizzes, observation and practice feedback |
| `src/lib/supabase/` | Server, browser and admin clients |
| `src/generated/card-art.json` | Art registry written by the art pipeline (client-safe) |
| `supabase/migrations/` | Schema, RLS, functions |
| `supabase/seed.sql` | Generated reference data |
| `supabase/tests/` | RLS integration tests (local Postgres + auth stub) |
| `art/` | Illustration spec, card definitions, manifest, fonts, sources |
| `scripts/` | Seed generator and art pipeline |
| `e2e/` | Playwright end-to-end and accessibility tests |

## Data model

| Table | Purpose |
| --- | --- |
| `profiles`, `user_preferences` | Created by trigger on sign-up; display name, timezone, reversals, write-first and AI preferences |
| `tarot_cards`, `learning_courses`, `learning_lessons` | Public reference data (generated seed) |
| `readings` | One row per reading: kind (`daily` / `daily_extra` / `question`), spread, category, question, context, local date and timezone, link to a parent reading for explicit new pulls |
| `reading_cards` | Card, position and orientation; unique per spread position and per card |
| `interpretation_snapshots` | Immutable interpretations (reference or AI) with generator and content version |
| `reading_followups` | Follow-up questions answered from the same cards |
| `journal_entries` | Pre-reveal interpretations, reflections (with resonance) and free entries |
| `learning_progress`, `quiz_attempts`, `practice_exercises` | Academy progress and history |
| `shared_readings` | Revocable public share tokens; read only through `get_shared_reading()` |
| `reading_feedback` | Optional rating per reading (reserved; resonance is currently captured on journal entries) |
| `ai_usage` | Per-user daily AI request counter used by `consume_ai_quota()` |

## AI integration

- Provider: Anthropic Claude via `@anthropic-ai/sdk`, server only. The model defaults to `claude-opus-5-5` and can be overridden with `ANTHROPIC_MODEL`.
- Structured output via `client.beta.messages.parse` with a zod schema, `effort: "medium"`, a cached system prompt, a 90 s timeout and 2 retries. `fallbacks: "default"` re-runs a refused request on Anthropic's recommended fallback model.
- Only the question, the optional context the user chose to share and the drawn cards' library entries are sent — never the user's identity or journal.
- Signed-in users are limited to 20 AI requests per day by default (stored in the database). Guest AI is off unless `ALLOW_GUEST_AI=true`, and is then limited per IP per server instance.
- If the AI fails, is refused or is unconfigured, the user sees a clear message and keeps the full reference reading.
