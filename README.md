# tarot-card-repo — The Daily Arcana

A mobile-first tarot reading, learning and journaling app with a Celestial Art Nouveau visual identity. It's built for personal daily practice first, with the architecture already in place for a public multi-user launch.

> **Status:** Phase 1 (foundations) is complete. The daily ritual UI, readings, academy pages, journal and auth screens are still to be built. This README will grow with each phase.

## What exists now

| Area | Where | Status |
| --- | --- | --- |
| 78-card knowledge base (canonical IDs, keywords, traditional meanings, symbolism, context meanings, exercises, related cards, sources) | `src/content/cards/` | Complete, validated by tests |
| Learning academy content: 12-level beginner path and four suit lessons, each with objectives, examples, an exercise and a quiz | `src/content/academy/` | Content complete; pages not yet built |
| Secure random card draw (Web Crypto, no modulo bias) | `src/lib/tarot/draw.ts` | Tested |
| Spreads: daily, one-card, three-card, five-card | `src/lib/tarot/spreads.ts` | Done |
| Offline reference interpretation (no AI needed) and interpretation schema | `src/lib/interpret/` | Tested |
| Supabase schema with row-level security | `supabase/migrations/` | Tested against local Postgres |
| Illustration spec and per-card art definitions | `art/` | Spec written; artwork not yet generated |

## Commands

```bash
npm install
npm run dev               # start the app at http://localhost:3000
npm test                  # unit tests (deck completeness, draw fairness, interpretations)
npm run test:db           # schema + row-level security tests (needs local Postgres)
npm run typecheck
npm run db:seed:generate  # regenerate supabase/seed.sql from the TypeScript content
```

`npm run test:db` uses `TEST_DATABASE_URL`, which defaults to `postgres://postgres:postgres@127.0.0.1:5432/postgres`. It creates and drops its own `daily_arcana_rls_test` database.

## Sources and tradition

Traditional meanings paraphrase A. E. Waite, *The Pictorial Key to the Tarot* (1911, public domain). Modern reflective interpretations are original editorial content and are labelled as such. The app presents tarot as a symbolic, reflective practice, not as a scientifically validated way to predict the future.
