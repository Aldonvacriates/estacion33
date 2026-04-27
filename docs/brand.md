# Brand split — Aldo Website LLC ↔ Estación 33

Two brands live in this repo. Keep them clearly separated so neither leaks
into the other.

## Aldo Website LLC (`aldowebsitellc.xyz`)

The dev shop / company. Owns the code, the infrastructure, and the contracts.

**Where it shows up**
- Repo / monorepo name: `aldowebsitellc`
- npm package scope: `@aldowebsitellc/ui`, `@aldowebsitellc/core`, `@aldowebsitellc/tokens`
- `package.json` `author` field: `"Aldo Website LLC"`
- License headers / `LICENSE` © `Aldo Website LLC`
- README, internal docs, ADRs
- Hosting / vendor accounts: Vercel, Supabase project, EAS / Expo, GitHub org, App Store Connect, Google Play Console, MercadoPago dev account
- Internal tooling: CI logs, Sentry org, PostHog project name
- Domain `aldowebsitellc.xyz` (company portfolio site — **out of scope** for this repo)

**Where it must NOT show up**
- Anywhere a customer sees: nav, footer, emails, push notifications, app store listings (display name), receipts, social media, marketing copy

## Estación 33

The customer-facing burger restaurant. Spanish-first. The actual product
shipped by this repo lives on the Estación 33 brand.

**Where it shows up**
- Web app `apps/web` — all UI copy, page titles, meta tags, OG images, favicon
- Mobile app `apps/mobile` — display name, splash screen, app icon, store listing copy + screenshots
- Push notifications, transactional emails (orders + reservations)
- MercadoPago "soft descriptor" / merchant name on customer credit-card statements
- Domain (TBD by owner — e.g. `estacion33.mx` / `.com`, separate from `aldowebsitellc.xyz`)

**Where it must NOT show up**
- Repo names, npm scopes, internal source-code identifiers, CI tooling

## Brand kit (Estación 33)

Seeded from the existing site's CSS and the menu image; lock in Phase 1.4.

| Token | Value | Notes |
|---|---|---|
| `brand/primary` | `#7DA640` | olive green |
| `brand/primary-hover` | `#6D9533` | |
| `brand/primary-dark` | `#2A3815` | nav, footer |
| `brand/secondary` | `#FE9F10` | orange CTA / badges |
| `brand/yellow-bg` | `#F6C42A` | header banner from menu image |
| `brand/black` | `#000000` | menu page background, dramatic on photos |
| `brand/text-on-dark` | `#FFFFFF` | |
| Typeface | **Poppins** | already in repo via Google Fonts |

**Logo**: `src/assets/images/logo.png` (current — verify this is the real
Estación 33 logo before reuse).

**Voice**: warm, casual, Spanish (Mexico). Catch phrases from the menu
image to consider in copy:
- *"¡Ahora puedes disfrutar!"*
- *"El carbón está hirviente"*
- *"Servicio a Domicilio"*

## Italianísimos

The menu image shows a sub-brand inside Estación 33: **"Italianísimos —
Disfruta el sabor de la comida italiana"** (lasagna, pasta dishes). Treat
this as a **menu category**, not a separate app. Single brand (Estación 33),
single domain, single login.
