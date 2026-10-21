# tarot-card-repo — Inhale Exhale

A mobile-first tarot companion for **daily reflection, thoughtful readings, learning all 78 cards and keeping a private journal**, with a night-sky, neon-accented look and an original line-art deck (cobalt figures, rainbow robes, golden rays). It's built for personal daily practice first, on the same architecture needed for a public multi-user launch.

> Tarot is presented here as a symbolic, reflective practice — not a scientifically validated way to predict the future.

## What works today

| Feature | Route | Notes |
| --- | --- | --- |
| Daily ritual | `/daily` | Local date, intention, theme/question, shuffle, face-down choice, flip reveal, write-before-reveal, interpretation, symbol lesson, journal. The card persists for the day; extra pulls are labelled and saved separately. |
| Question readings | `/readings` | One-, three- and five-card spreads with position meanings shown first, distinct cards, orientation, per-position interpretation, connections, next steps, follow-ups that never swap cards |
| Deck library | `/deck`, `/deck/[id]` | All 78 cards: keywords, traditional meaning (Waite 1911, paraphrased), symbolism, upright/reversed, five life-area meanings, shadow, misconceptions, example, reflection, memory aid, related cards, observation exercise, interpretation exercise, quiz |
| Academy | `/academy`, `/academy/[lesson]`, `/academy/practice` | 12-level beginner path, four suit lessons, progress tracking, quizzes, practice mode (beginner / intermediate / advanced) with constructive feedback |
| Journal | `/journal` | History filtered by type, life area and bookmarks; free entries; statistics computed from real records; learning progress |
| Accounts | `/signup`, `/login`, `/reset-password`, `/onboarding`, `/settings` | Email + password auth, password reset, preferences, data export, account deletion — **requires Supabase configuration** |
| Sharing | `/readings/[id]/share`, `/s/[token]` | Revocable public links (accounts only); never includes your journal or context |
| Privacy & methodology | `/about` | How cards are drawn, how interpretations work, data handling |
| Guest mode | everywhere | Works with no backend at all: data stays in this browser and is clearly labelled as such |

### What still needs you

1. **Supabase** isn't configured yet, so accounts, sync, sharing and account deletion are unavailable until you add credentials (see *Set up Supabase* below). Guest mode works now.
2. **AI interpretations** need an `ANTHROPIC_API_KEY`. Without one, every reading uses the full reference interpretation, and the UI says AI is unavailable.
3. **Artwork:** all 78 cards are drawn as original SVG line art in `src/components/cards/art/` (see CLAUDE.md for how to edit or add cards). The older raster pipeline in `art/` and `scripts/art/` is kept for commissioned artwork.

## Quick start (local)

```bash
npm install
cp .env.example .env.local   # optional — the app runs in guest mode without it
npm run dev                  # http://localhost:3000
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Develop, build, serve |
| `npm test` | Unit tests: deck completeness, draw fairness, interpretations, AI validation, stores, quizzes, stats, art pipeline |
| `npm run test:db` | Schema and row-level security tests against local PostgreSQL (uses `TEST_DATABASE_URL`) |
| `npm run test:e2e` | Playwright end-to-end and accessibility (axe, WCAG 2.1 AA) tests on mobile and desktop (guest mode) |
| `npm run test:e2e:account` | Account-mode end-to-end tests against a Supabase-compatible stack (see below) |
| `npm run typecheck`, `npm run lint` | Type and lint checks |
| `npm run db:seed:generate` | Regenerate `supabase/seed.sql` from the TypeScript content |
| `npm run art:manifest` | Rebuild prompts and alt text in `art/manifest.json` (keeps production status) |
| `npm run art:process -- <card-id>` | Frame, title and optimise a source illustration from `art/source/` |

### Testing account mode locally (no Supabase project needed)

`supabase/local-stack/` runs a minimal Supabase-compatible stack — your local PostgreSQL plus Supabase's GoTrue (auth) and PostgREST containers from Docker Hub, behind a tiny gateway — so sign-up, row-level security, sharing, export and deletion can be tested end to end:

```bash
npm run stack:up                         # needs Postgres on 127.0.0.1:5432 and Docker; writes supabase/local-stack/.env.local-stack
npm run stack:gateway &                  # http://localhost:54321
set -a; source supabase/local-stack/.env.local-stack; set +a
NEXT_DIST_DIR=.next-account npm run build
AI_PROVIDER=test-double NEXT_DIST_DIR=.next-account npx next start -p 3200 &
E2E_AI=test-double npm run test:e2e:account
```

`AI_PROVIDER=test-double` swaps in a clearly labelled fake AI so the AI routes, quotas and snapshots can be tested without an API key. Never set it in production.

Playwright in this repo uses the system Chromium. If it can't find a browser, set `PLAYWRIGHT_BROWSERS_PATH` or run `npx playwright install chromium`.

## Set up Supabase (accounts)

1. Create a project at [supabase.com](https://supabase.com).
2. Run the migration and seed. With the [Supabase CLI](https://supabase.com/docs/guides/cli): `supabase link --project-ref <ref>`, then `supabase db push`, then `psql "<connection string>" -f supabase/seed.sql`. Alternatively, paste `supabase/migrations/*.sql` and then `supabase/seed.sql` into the SQL editor.
3. In **Authentication → URL configuration**, set the Site URL to your app URL and add `<your-url>/auth/callback` to the redirect URLs.
4. Put the project URL and anon key in `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Put the service-role key in `SUPABASE_SERVICE_ROLE_KEY`; it is used only for account deletion and must never be exposed to the browser.
5. Restart the app. Sign-up, the journal and sharing then use your database.

The daily AI limit per user is stored in the database: `update private.settings set value = '30' where key = 'ai_daily_request_limit';`

## Set up AI interpretations (optional)

Add `ANTHROPIC_API_KEY` to `.env.local` (and to your Vercel project settings). The model defaults to `claude-opus-5-5`; override it with `ANTHROPIC_MODEL`. Guest AI is off by default (`ALLOW_GUEST_AI=false`). Keys are read only on the server.

## Deploy to Vercel

Import the repository, add the environment variables from `.env.example`, and deploy. No other configuration is needed. Set `NEXT_PUBLIC_SITE_URL` to your production URL so email links work.

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — how the pieces fit, the data model, AI integration, security
- [docs/illustration-spec.md](docs/illustration-spec.md) — the 78-card illustration spec, workflow and review checklist
- [CLAUDE.md](CLAUDE.md) — conventions and commands for contributors (and Claude)

## Sources and tradition

Traditional meanings paraphrase A. E. Waite, *The Pictorial Key to the Tarot* (1911, public domain). Major Arcana numbering follows Waite (Strength VIII, Justice XI). Modern reflective interpretations, context meanings and exercises are original editorial content and are labelled as such. All artwork must be original or have verified usage rights.
