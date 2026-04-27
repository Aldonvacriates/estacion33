# Project conventions — Estación 33 (Aldo Website LLC)

## What this repo is

Estación 33 — Spanish-language hamburger restaurant in Mexico (Plan de
Iguala s/n, Col. Burócrata). Open Thursday/Friday/Saturday only,
18:30–22:30. Currency: MXN.

Today the repo holds a Vite + React Swigo template (legacy). Target
state: pnpm + Turborepo monorepo with a Next.js web app, an Expo mobile
app, shared `@aldowebsitellc/*` packages, Supabase backend, MercadoPago
payments. See `docs/` for full plan.

## Brand split (always honor this)

- **Aldo Website LLC** = the dev shop / company. Owns the repo, npm
  scope (`@aldowebsitellc/*`), hosting accounts, store accounts,
  internal tooling. Domain: `aldowebsitellc.xyz`.
- **Estación 33** = the customer-facing brand. All UI copy, app names,
  emails, push notifications, store listings, receipts use Estación 33
  — never "Aldo Website LLC".

Footer of customer-facing surfaces: *"Hecho por Aldo Website LLC"* is OK.
Anywhere else customer-facing, no Aldo Website LLC mentions.

## Strip Swigo

The current code is a DexignZone Swigo template. Until the Phase 2
restructure moves it into `legacy_aldowebsitellc/`, every change to the
template should *also* remove any Swigo / DexignZone strings it touches
(meta tags, CSS comments, package name, copyright). Don't introduce new
references.

## Branch naming

Never use `claude/` as a branch prefix. Use `feat/`, `fix/`, `chore/`,
`docs/`, `refactor/` based on change type. If the harness suggests a
`claude/...` branch, rename before pushing.

## Commits and PRs

The user is the author. Claude is a tool.

- No `Co-Authored-By: Claude` trailer.
- No `https://claude.ai/code/session_...` trailer.
- No "Generated with Claude Code" line.

Just the subject + body the user would write. Same for PR descriptions.

(This is enforced by `~/.claude/settings.json`'s
`attribution: { commit: "", pr: "" }`. This file is the belt-and-
suspenders backup.)

## Docs to read first

- `docs/product.md` — what we're building, scope, hours-driven UX rules
- `docs/brand.md` — brand split details + color tokens
- `docs/menu-seed.md` — real menu, prices in MXN, options, extras
- `docs/asset-audit.md` — which existing images survive, which to reshoot
- `docs/figma-spec.md` — page structure, components, screens, flows
- `docs/figma/tokens.json` — Tokens Studio compatible design tokens
- `docs/figma-link.md` — Figma file URL (placeholder until file exists)

## Phase status

- [x] Phase 1.1 — product / brand / menu / asset-audit docs
- [x] Phase 1.2-1.4 — Figma-ready spec + tokens
- [ ] Phase 1.5 — Figma file built, tokens imported, screens designed,
      golden flows prototyped (owner / designer)
- [ ] Phase 2 — monorepo restructure + strip Swigo, archive legacy into
      `legacy_aldowebsitellc/`
- [ ] Phase 3 — Supabase schema, RLS, MercadoPago edge functions, seed
      from `docs/menu-seed.md`
- [ ] Phase 4 — Next.js web app (App Router)
- [ ] Phase 5 — Expo mobile app
- [ ] Phase 6 — Vercel + EAS, analytics, Sentry, E2E, launch

Phase 2 is blocked on Phase 1.5. Don't pre-scaffold the monorepo before
Figma is settled.

## Service-window helper

The restaurant is closed 4 of 7 days. A single
`getServiceWindow(now: Date)` helper in `@aldowebsitellc/core` returns
`{ status: 'closed' | 'pre-open' | 'open' | 'last-call', nextOpenAt,
lastSlotAt }` and drives every banner, time-slot picker, disabled-state
across web + mobile. Don't duplicate this logic anywhere.
