# Phase 4 — Web app

Living plan. Update statuses as we ship slices.

## Slice progress

- [x] **4.0** — Wire Supabase client into `apps/web` (server + client, typed)
- [x] **4.1** — Public menu (read-only, server-rendered)
- [ ] **4.2** — Product detail with options (`/menu/[slug]`)
- [ ] **4.3** — Cart (Zustand + localStorage)
- [ ] **4.4** — Checkout: form → insert order + items → MercadoPago or cash
- [ ] **4.5** — Order confirmation + tracking (`/orden/[id]`)
- [ ] **4.6** — Reservations (`/reservar`)
- [ ] **4.7** — Auth (magic link) + account pages
- [ ] **4.8** — Admin (orders dashboard + menu toggle)

## Conventions

- **Routes** in Spanish (`/menu`, `/reservar`, `/cuenta`, `/orden/[id]`, `/admin/...`)
- **All UI copy** via `i18n.es` from `@estacion33/core`
- **Money** stored as integer cents in DB; rendered via `formatMxn()` helper
- **Server components by default**; client components only where needed (cart, forms)
- **Supabase clients**: `lib/supabase/server.ts` for server components/actions, `lib/supabase/client.ts` for browser
- **Schema namespace**: every supabase client config sets `db: { schema: 'estacion33' }`
- **Service-window UX**: `getServiceWindow()` from core drives banners, time-slot pickers, disabled CTAs

## Next slice (4.2 — product detail)

When 4.1 looks right:
- Route `/menu/[slug]` server-renders one product
- Fetch product + product_options + option_values
- Render image, price, description, options (single-select/multi-select per `multi`/`required`)
- Sticky bottom "Agregar al carrito" CTA (4.3 hooks this up)

## Open issues to resolve before launch

From `docs/menu-seed.md`:
- All products currently `available=false`. Owner must confirm prices & flip on per item.
- 6 unresolved menu items (La Casa price, second Texas, Italianísimos pasta names, Ensalada protein logic, Pollo Grill Especial differentiator, real photos)
