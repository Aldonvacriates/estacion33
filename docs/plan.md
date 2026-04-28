# Plan: Estación 33 — Web + Mobile App (Figma-First)

> **Status as of 27 Apr 2026:** Phases 1, 2, and most of Phase 3 are done.
> See `docs/phase-3-plan.md` for the active Phase 3 punch list. This file is
> the master plan / source of truth. A few details diverged from the
> original draft — noted inline as **[ACTUAL]**.

> **Org:** Aldo Website LLC (`aldowebsitellc.xyz`) — dev shop / repo owner.
> **Product:** Estación 33 — the customer-facing hamburger restaurant brand built and shipped by Aldo Website LLC.
> All Swigo template attribution gets stripped from the codebase.
>
> **Real-world facts (from menu) driving the design:**
> - Country: **Mexico** · Currency: **MXN** · Language: **Spanish only** at v1
> - Hours: **Thursday, Friday, Saturday — 18:30 to 22:30 only** (12 service hours/week)
> - Address: Plan de Iguala s/n, Col. Burócrata
> - Categories: Snacks · Nuestras Burgers · Las Creativas · Las de Chicken · Ensaladas · Italianísimos · Bebidas · Extras
>
> Phase 1.1 docs are written: see `docs/brand.md`, `docs/product.md`, `docs/menu-seed.md`, `docs/asset-audit.md`.

## Context

`/home/user/estacion33` today is a single Vite + React + TypeScript site bootstrapped from the **Swigo** restaurant template (DexignZone). It has 44 template pages, ~120 stock food images, a Spanish-localized title (*"Estación 33 | Hamburguesas, Aros, Papas & Boneless"*), and a green/orange palette — but it is **template-shaped, not product-shaped**: no real ordering flow, no reservations, no accounts, no backend, no mobile app. The package is still named `swigo` and several pages are dead routes inherited from the template.

Aldo Website LLC wants to turn Estación 33 into a real product:

- **Web app** — public site **+** ordering, reservations, customer accounts
- **Mobile app** — same product on iOS and Android
- **Driven by a Figma design**, not by the template's visuals

### Decisions already made (from clarification)

| Area | Choice |
|---|---|
| Scope | Full platform: menu browsing + online ordering + reservations + customer accounts/loyalty |
| Web framework | **Next.js (App Router)** — rebuild clean, retire the Swigo template |
| Mobile stack | **React Native + Expo** |
| Backend | **Supabase** (Postgres + Auth + Storage + Edge Functions) |
| Payments | **MercadoPago** **[ACTUAL: + cash/pickup as primary v1 path; MercadoPago for online customers]** |
| Figma | I produce a Figma-ready spec; design is then built in Figma before code. **[ACTUAL: pivoted to design-in-code after Figma First Draft pass — see `docs/figma-link.md`]** |
| Branch | All work on `claude/plan-app-design-Bcatc`. **[ACTUAL: Phase 1 merged on `feat/plan-app-design-Bcatc`; Phase 2+ on `feat/phase-2-monorepo`]** |

### Goal of this plan

Get from "Swigo template clone" to "Figma design → working web + mobile app on Supabase + MercadoPago", in clearly-staged phases. Phase 1 ends with a Figma design ready to implement; Phase 2+ implements it.

---

## Architecture overview

```
┌────────────────────────┐    ┌────────────────────────┐
│  Web (Next.js App Rtr) │    │  Mobile (Expo / RN)    │
│  apps/web              │    │  apps/mobile           │
└──────────┬─────────────┘    └──────────┬─────────────┘
           │                             │
           │   import { ... } from '@estacion33/ui' / '@estacion33/core'
           ▼                             ▼
┌──────────────────────────────────────────────────────┐
│  packages/ui     React + RN-compatible primitives    │
│  packages/core   types, API client, validation, i18n │
│  packages/tokens design tokens (colors, type, space) │
└──────────────────────┬───────────────────────────────┘
                       │ supabase-js
                       ▼
┌──────────────────────────────────────────────────────┐
│  Supabase: Postgres + Auth + Storage + Edge Funcs    │
│   schema: estacion33 (shared project, namespaced)    │
│   tables: products, categories, orders, reservations │
│           profiles, addresses, loyalty_points,       │
│           service_windows                            │
│   edge fn: mercadopago-create-preference, webhook    │
└──────────────────────────────────────────────────────┘
                       │
                       ▼  (server-to-server)
                  MercadoPago API
```

Repo becomes a **pnpm + Turborepo monorepo** so web and mobile share types, tokens, and logic. Tokens live in `packages/tokens` and are exported as both CSS variables (web) and a JS object (RN), keeping the Figma design as the single source of truth.

**[ACTUAL]** Package scope is `@estacion33/*`, not `@aldowebsitellc/*`. Cleaner, matches deployed app names. Supabase project is shared (`aldowebsitellc` org, `aldowebsitellc` project) with all our tables in the **`estacion33` Postgres schema** — see `supabase/README.md` for the future split path.

---

## Phase 1 — Product + Figma (no code yet)

This phase ends when a Figma file exists with the screens below, the design system filled in, and clickable prototypes for the three golden flows.

### 1.1 Product brief (1-pager, write into `/docs/product.md`)

- **Who**: walk-in and delivery customers of a Spanish-speaking burger joint.
- **Jobs**: (a) see the menu fast on a phone, (b) order pickup or delivery and pay online, (c) book a table for a group, (d) come back and order again with saved address + payment.
- **Non-goals (v1)**: multi-location, kitchen display system, driver app, marketing CRM. Note these explicitly so they don't creep in.

### 1.2 Information architecture — screen list

**Public (web + mobile)**
1. Home / Landing — hero + service-window banner ("Abrimos viernes 18:30") + featured items + reservar CTA
2. Menu (categories per real menu: Snacks · Nuestras Burgers · Las Creativas · Las de Chicken · Ensaladas · Italianísimos · Bebidas)
3. Product detail (with options: sabor del boneless, tipo de queso, extras like tocino +$10, mezcalada +$15)
4. Gallery
5. About / Nuestra historia
6. Contacto + ubicación (map, hours)
7. FAQ

**Ordering**
8. Cart
9. Checkout — delivery vs pickup, address, **time slot constrained to Thu/Fri/Sat 18:30–22:30**, notes
10. Payment (MercadoPago Checkout Pro / Brick — Mexico account, MXN)
11. Order confirmation
12. Order tracking ("recibido → en preparación → listo / en camino → entregado")

> **Closed-state UX is a first-class concern**: the restaurant is closed 4 of 7 days. A `getServiceWindow(now)` helper in `@estacion33/core` returns `{ status: 'closed' | 'pre_open' | 'open' | 'last_call', nextOpenAt, closesAt, lastSlotAt }` and drives every banner, time-slot picker, and disabled CTA across web + mobile. **[DONE]** See `packages/core/src/service-window.ts` and `docs/product.md` § "Hours-driven UX rules".

**Reservations**
13. Reserve table — date, time, party size, contact
14. Reservation confirmation

**Account**
15. Sign in / Sign up (email + magic link, optional Google)
16. Profile
17. Saved addresses
18. Order history + reorder
19. Loyalty / puntos

**Admin (web only, v1.1)**
20. Orders dashboard (live)
21. Menu CRUD
22. Reservations dashboard

### 1.3 User flows to prototype in Figma

- **Order a burger for delivery** — Home → Menu → Product → Cart → Checkout → MercadoPago → Confirmation → Tracking
- **Reserve a table** — Home → Reservar → form → Confirmation (+ email)
- **Returning customer reorders** — Sign in → Order history → Reorder → Pay → Confirmation

### 1.4 Design system (the *real* deliverable of Phase 1)

Extract starting values from the existing site so the brand carries forward, then formalize:

- **Color tokens** (seed from `src/assets/css/style.css`):
  - `brand/primary` `#7DA640`, `brand/primary-hover` `#6D9533`, `brand/primary-dark` `#2A3815`
  - `brand/secondary` `#FE9F10` (orange accent for CTAs/badges)
  - Plus neutrals 50–900, semantic `success` / `warning` / `danger` / `info`
- **Typography** — keep **Poppins**; define scale (display / h1–h4 / body-lg / body / caption / label) with line-heights.
- **Spacing scale** — 4 px base: 4, 8, 12, 16, 24, 32, 48, 64.
- **Radii** — 4 / 8 / 16 / pill.
- **Elevation** — 3 shadow levels.
- **Components** (all built as Figma variants): Button (primary/secondary/ghost × sm/md/lg × default/hover/disabled), Input, Select, Stepper, Tabs, Badge, Tag, Card (product), Bottom Nav (mobile), App Bar, Toast, Modal, Empty State, Skeleton.

Tokens are exported to JSON (Figma Tokens / Variables) so `packages/tokens` can consume them in Phase 2 — **no hand-syncing**.

**[ACTUAL]** Tokens shipped to Figma via Tokens Studio plugin and to code at `packages/tokens/src/{colors,spacing,typography,shadows,index,css}.ts`. Single source of truth lives in `docs/figma/tokens.json`. Component variants beyond Button were skipped in Figma; pivoted to design-in-code per Phase 2 decision.

### 1.5 Asset audit

Walk `src/assets/images/` and tag which photos are reusable real-product imagery vs generic stock to be reshot. Output: `/docs/asset-audit.md` with keep/replace/reshoot per file.

**Phase 1 exit criteria**: Figma file with all 19 public/customer screens at mobile + desktop sizes, design system page filled, three flows clickable. **[PARTIAL — design system + tokens shipped; full screen set replaced by First Draft generation + decision to design-in-code]**

---

## Phase 2 — Repo restructure (monorepo)

Done in one PR so everything moves together.

1. Create monorepo skeleton:
   ```
   /apps/web         (Next.js 15 App Router, TS)
   /apps/mobile      (Expo SDK 52+, RN, TS)
   /packages/ui      shared components
   /packages/core    types, API client, zod schemas, i18n
   /packages/tokens  design tokens (colors/type/space) → CSS vars + JS
   /supabase         migrations, seed, edge functions
   /docs             product brief, asset audit, ADRs
   ```
2. Add `pnpm-workspace.yaml`, `turbo.json`, root `package.json`, shared `tsconfig.base.json`, ESLint + Prettier configs at root.
3. **Archive the current site** — move `src/`, `index.html`, `vite.config.ts`, `.eslintrc.cjs` into `legacy_aldowebsitellc/` (kept on branch as reference for copy/imagery, **not** built). Delete once Phase 4 reaches feature parity. **[ACTUAL: archived to `_legacy/`, then deleted same session after extracting `favicon.png`, `logo.png`, `logo-alt.png` to `apps/web/public/`.]**
4. Rename root `package.json` `name` from `swigo` to `aldowebsitellc` (monorepo); the deployed customer app inside `apps/web` is named `estacion33-web`, mobile is `estacion33-mobile`. **[ACTUAL: root renamed to `estacion33`; package scope `@estacion33/*`.]**
5. **Strip Swigo references** everywhere: package name, `index.html` `<meta>` tags ("Swigo - Fast Food And Restaurant ReactJs Template | DexignZone"), any DexignZone copyright in CSS/SCSS headers, footer credits, README boilerplate. Author becomes "Aldo Website LLC".
6. Move reusable photos from `src/assets/images/` into `apps/web/public/images/` and `packages/ui/assets/` per the asset audit.

**Phase 2 exit**: `pnpm dev` boots a blank Next.js app and a blank Expo app side by side; both import a `<Button />` from `@estacion33/ui` rendering with the Estación 33 brand color. `git grep -i swigo` returns zero hits outside `_legacy/`. **[DONE — both apps typecheck; `pnpm dev` not yet run end-to-end.]**

---

## Phase 3 — Supabase backend

1. `supabase init`; create migrations under `/supabase/migrations/`:
   - `profiles` (1:1 with `auth.users`, name, phone, locale)
   - `categories`, `products`, `product_options`, `option_values`
   - `addresses` (user_id, label, line1, city, lat, lng)
   - `orders` (user_id, status, totals, fulfillment: delivery|pickup, address_id, scheduled_for, payment_status, mp_preference_id)
   - `order_items` (order_id, product_id, qty, unit_price, options jsonb)
   - `reservations` (user_id|null, guest_name, phone, party_size, slot_at, status)
   - `loyalty_points` (user_id, points, source, order_id)
2. **Row Level Security** on every table. Customers read/write only their own rows; `service_role` for admin and edge functions.
3. Edge Functions (Deno):
   - `mercadopago-create-preference` — input: order_id; output: MP `init_point` URL.
   - `mercadopago-webhook` — verifies signature, marks order `paid`, decrements stock if tracked, awards loyalty points.
   - `reservation-confirm-email` — sends confirmation via Resend/Supabase email.
4. Seed script with the real Estación 33 menu — see `docs/menu-seed.md` for the structured source (8 categories, ~40 items, options, extras, all in MXN cents). Resolve the open questions at the bottom of that doc with the owner before locking the seed.
5. **Service-window config table** (`service_windows`) seeded with `[{ dow: 4, opens: '18:30', closes: '22:30' }, { dow: 5, … }, { dow: 6, … }]`. The `getServiceWindow()` helper reads from this so the owner can extend hours later without a code change.

**Phase 3 exit**: from a Supabase SQL console, can simulate full order lifecycle (pending → paid → preparing → ready → delivered) and a reservation; webhook verified locally with `supabase functions serve`. **[DONE for schema + seeds + edge functions; live signed-payload test pending MERCADOPAGO_WEBHOOK_SECRET setup.]**

---

## Phase 4 — Web app (`apps/web`)

Implement the Figma. Key files:

- `apps/web/app/layout.tsx` — fonts (Poppins), `<ThemeProvider>` wiring tokens to CSS vars, top nav + footer, toast portal.
- `apps/web/app/(public)/page.tsx` — home (hero + featured menu + reserve CTA).
- `apps/web/app/(public)/menu/page.tsx`, `apps/web/app/(public)/menu/[slug]/page.tsx` — server-rendered for SEO using Supabase data.
- `apps/web/app/(public)/reservar/page.tsx` — reservation form (zod-validated, server action).
- `apps/web/app/(shop)/cart/page.tsx`, `apps/web/app/(shop)/checkout/page.tsx`, `apps/web/app/(shop)/orden/[id]/page.tsx` — ordering flow.
- `apps/web/app/(account)/...` — sign-in, profile, addresses, order history.
- `apps/web/app/admin/...` — protected by Supabase role; orders + menu CRUD.
- `apps/web/lib/supabase/{server,client}.ts` — SSR-safe Supabase clients.
- `apps/web/lib/cart.ts` — Zustand cart store, persisted to localStorage.

i18n: Spanish only at v1 via `packages/core/i18n/es.ts`; structure permits adding `en.ts` later without refactor.

**Phase 4 exit**: a real customer can browse menu → order → pay (MercadoPago test creds) → see confirmation; a guest can reserve a table; an admin can flip an order's status.

---

## Phase 5 — Mobile app (`apps/mobile`)

Mirrors the web product, no admin screens.

- Expo Router with `(tabs)` layout: **Inicio · Menú · Carrito · Cuenta**.
- Same `@estacion33/core` API client and zod schemas as web — zero duplication.
- Same `@estacion33/ui` primitives (Button, Card, Input) implemented for RN; tokens come from `@estacion33/tokens`.
- Auth via `@supabase/supabase-js` + Expo SecureStore for session persistence.
- MercadoPago via WebView checkout (cleanest cross-platform path); deep link `estacion33://orden/[id]` returns to the order screen.
- Push notifications via Expo for order status updates (Edge Function calls Expo Push API on order status change).

**Phase 5 exit**: TestFlight / internal Play track build that passes the same three golden flows as web.

---

## Phase 6 — Launch readiness

- Hosting: web on Vercel under Aldo Website LLC's account (env vars for Supabase + MercadoPago); custom domain **`https://www.estacion33.com`** (confirmed by owner Apr 2026). Mobile on EAS Build for store submission, App Store / Play Store listings under "Aldo Website LLC".
- Production env: set Supabase secret `PUBLIC_WEB_URL=https://www.estacion33.com` so MercadoPago `back_urls` resolve and `auto_return: 'approved'` is enabled (in dev we keep it localhost / unset, no auto_return).
- Analytics: PostHog (events: `view_menu`, `add_to_cart`, `begin_checkout`, `purchase`, `reserve_table`).
- Sentry on web + mobile.
- E2E: Playwright on web for the order flow; Detox or Maestro on mobile for the same.
- Legal: terms, privacy, MercadoPago compliance copy in Spanish.

---

## Critical files / paths

**To create**
- `/docs/product.md`, `/docs/asset-audit.md`, `/docs/figma-link.md`, `/docs/brand.md` (Aldo Website LLC vs. Estación 33 branding rules)
- `/packages/tokens/src/index.ts` (and `colors.ts`, `typography.ts`, `spacing.ts`) — published as `@estacion33/tokens`
- `/packages/ui/src/Button.tsx` (web + native variants) — published as `@estacion33/ui`
- `/packages/core/src/{types,api,schemas,i18n}/` — published as `@estacion33/core`
- `/supabase/migrations/0001_init.sql`, `/supabase/functions/mercadopago-create-preference/index.ts`, `/supabase/functions/mercadopago-webhook/index.ts`
- `/apps/web/app/...` (per Phase 4)
- `/apps/mobile/app/...` (per Phase 5)
- `/turbo.json`, `/pnpm-workspace.yaml`, `/tsconfig.base.json`

**To reuse from existing repo**
- Brand color values from `src/assets/css/style.css` (`#7da640`, `#6d9533`, `#2a3815`, `#fe9f10`)
- Logo from `public/favicon.png` and `src/assets/images/logo.png`
- Real-product photography from `src/assets/images/menu-small/` and `gallery/` (per asset audit)
- Spanish copy from `src/pages/JsonData.tsx` and `index.html`

**To archive in `_legacy/`, then delete** (after Phase 4 reaches parity)
- `src/` (44 template pages), `vite.config.ts`, `.eslintrc.cjs`, root `index.html`, all Swigo-template-only assets, README boilerplate
- Any remaining DexignZone / Swigo strings across CSS, SCSS, HTML, and JSON

**[ACTUAL: `_legacy/` already deleted in Phase 2 after extracting logo + favicon to `apps/web/public/`.]**

---

## Verification

**Phase 1 (Figma)** — three clickable prototype flows reviewed by the owner; design tokens exported to JSON.

**Phase 2 (monorepo)**
```
pnpm install
pnpm dev          # web on :3000, expo on :8081
```
Both apps render `<Button />` from `@estacion33/ui` with `#7DA640`.

**Phase 3 (Supabase)**
```
supabase start
supabase db reset      # migrations + seed
supabase functions serve mercadopago-webhook
```
SQL console can transition an order pending → paid → delivered; webhook signed-payload test passes.

**Phase 4 (web)** — Playwright spec: anonymous user orders a burger with MercadoPago test card `5031 7557 3453 0604` and lands on `/orden/[id]` with status `paid`. Reservation form creates a row visible in the admin dashboard.

**Phase 5 (mobile)** — Maestro flow: launch app → menu → add to cart → checkout → MercadoPago WebView → success → push notification fires when admin marks order `ready`.

**Phase 6** — Lighthouse ≥ 90 on home and menu (web); EAS internal build installs on a real iOS + Android device.

---

## Risk + sequencing notes

- **Don't start code before Phase 1 ships.** Building without the Figma will rebuild Swigo with new colors.
- **Tokens are the contract** between Figma and code — invest there in Phase 1, save weeks later.
- MercadoPago webhook verification is the only place we cannot mock; allocate explicit time in Phase 3.
- Keep `_legacy/` until Phase 4 reaches parity; delete in the same PR that ships v1. **[ACTUAL: deleted early after extracting needed assets.]**
- Admin screens (Phase 4) are the bare minimum — a real KDS can come later without changing the schema.
