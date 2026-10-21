# CLAUDE.md — The Daily Arcana

Guidance for anyone (human or Claude) changing this codebase. Read `docs/ARCHITECTURE.md` for the big picture.

## Stack

Next.js 15 App Router · React 19 · TypeScript (strict) · Tailwind CSS v4 (tokens in `src/app/globals.css`) · Supabase (Postgres + Auth via `@supabase/ssr`) · zod · Anthropic SDK (server only) · Vitest · Playwright + axe.

## Commands

```bash
npm run dev            # local dev server
npm test               # unit tests (fast; run after every change)
npm run test:db        # RLS tests — needs local Postgres: pg_ctlcluster 16 main start
npm run test:e2e       # Playwright (builds and starts the app on :3100 unless E2E_NO_SERVER=1)
npm run typecheck && npm run lint
npm run build
npm run db:seed:generate   # after editing src/content/**
npm run art:manifest       # after editing art/cards.definitions.json or art/style-spec.json
npm run art:process -- <card-id>
```

## Non-negotiable product rules

- **Randomness is independent.** Never let the question, category, user history or an AI influence which cards are drawn. Use `drawCards` from `src/lib/tarot/draw.ts` only.
- **No fabricated meanings or sources.** Traditional meanings come from `src/content/cards/*` (Waite 1911, paraphrased). AI prompts must stay grounded in that data. Label modern interpretation as modern.
- **No predictions, no mind-reading.** Never claim to know another person's private thoughts or intentions, and never guarantee outcomes. Outlooks must state their uncertainty.
- **History is immutable.** Saved cards and interpretation snapshots are never edited; new interpretations are appended as new snapshots. A "new pull" is a new, clearly labelled reading.
- **Honest UI.** If something is unavailable (AI, accounts, artwork), say so plainly. Never show a broken image or an unlabelled placeholder for card art — use `TarotCard`, which handles pending art.
- **Secrets stay on the server.** Only `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY`/`SITE_URL` may reach the browser. Files that touch secrets import `server-only`.

## Conventions

- **Card IDs:** `major-NN-slug` / `<suit>-NN-<rank>`; use helpers in `src/lib/tarot/ids.ts`. Never hand-type names; get them from `getCard`/`requireCard`.
- **Validation:** every API input goes through a zod schema (`parseBody`). Route handlers are wrapped with `handler()` from `src/lib/api.ts` for consistent errors; use `requireUser()` for auth.
- **Authorization:** rely on RLS, and also pass `user_id` explicitly on inserts. New private tables need RLS policies, explicit grants, and tests in `supabase/tests/rls.test.ts`.
- **Schema changes:** add a new timestamped file in `supabase/migrations/`; never edit an applied migration.
- **Content changes:** edit `src/content/**`, bump `CARD_CONTENT_VERSION` for meaning changes, run `npm test` (the deck validator must pass), then `npm run db:seed:generate`.
- **Storage modes:** UI talks to `readingsClient(mode)` / `learningClient(mode)`; add new capabilities to both the guest and account implementations.
- **Styling:** pages are light parchment. Use the design tokens: `page` / `page-raised` / `page-sunk` for surfaces, `ink` for text, `vermilion` for accents and links, `lapis` for focus, `gold` for rules and ornament only (`gold-ink` when gold-coloured text is needed), plus `burgundy` and `sage`. `midnight` / `indigo` are reserved for the card back and the component classes (`panel`, `panel-night`, `btn`, `btn-primary`, `btn-ghost`, `field`, `eyebrow`). Keep contrast at WCAG AA or better; the axe tests enforce it.
- **Accessibility:** every control needs a visible label, keyboard support and visible focus. Animations must respect reduced motion (handled globally in `globals.css`). Card images need meaningful alt text from the art registry.
- **Art:** the frame and title are composited by `scripts/art/frame.ts`; prompts must never ask the model for borders or text. Don't change `art/style-spec.json` without bumping its version (it invalidates approved art).
- **Comments:** explain *why*, briefly. Match the surrounding style.

## Environment

See `.env.example`. With no environment variables the app runs fully in guest mode with reference readings.
