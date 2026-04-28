# Estación 33

Mexican hamburger restaurant — web + mobile platform built by **Aldo Website LLC**.

- **Web** — Next.js 15 App Router (`apps/web`)
- **Mobile** — Expo / React Native (`apps/mobile`)
- **Shared** — design tokens, UI primitives, types, schemas, i18n (`packages/*`)
- **Backend** — Supabase (Postgres + Auth + Storage + Edge Functions)
- **Payments** — MercadoPago (MXN, Mexico account)

## Layout

```
apps/
  web/              Next.js customer site + admin
  mobile/           Expo customer app
packages/
  tokens/           design tokens (colors, type, spacing, radii)
  ui/               shared UI primitives (Button, etc. — web + native)
  core/             types, zod schemas, i18n, service-window helper
supabase/           migrations + edge functions (Phase 3)
docs/               product, brand, menu seed, asset audit, Figma spec
```

## Develop

```sh
pnpm install
pnpm dev              # turbo runs web (:3000) + expo dev server
```

Per-app:

```sh
pnpm --filter estacion33-web dev
pnpm --filter estacion33-mobile dev
```

## Phase status

- Phase 1 — product + brand + tokens + Figma reference (done)
- Phase 2 — monorepo + tokens + skeleton apps (this PR)
- Phase 3 — Supabase schema + MercadoPago edge functions
- Phase 4 — web app feature parity
- Phase 5 — mobile app feature parity
- Phase 6 — launch readiness
