# Phase 3 — Backend (Supabase + MercadoPago)

Living plan. Update statuses as we go.

## Done

- [x] Supabase CLI installed (`pnpm add -Dw supabase`, allowed in `pnpm-workspace.yaml`)
- [x] Linked to project `odzqcbbnkwkwkdajtswf` (`aldowebsitellc` org)
- [x] Practice migration lifecycle (`hello_world` + `drop_hello_world`) — workflow proven
- [x] `supabase/README.md` documents schema strategy + future migration to dedicated project
- [x] **0001 init_estacion33_schema** — 11 tables in `estacion33` schema:
  `profiles`, `categories`, `products`, `product_options`, `option_values`,
  `addresses`, `service_windows`, `orders`, `order_items`, `reservations`,
  `loyalty_points`. Indexes, enums (`order_status`, `fulfillment_type`,
  `payment_status`, `reservation_status`), `updated_at` trigger, full RLS.
- [x] **0002 seed_service_windows** — Thu/Fri/Sat 18:30–22:30 inserted
- [x] Verified in Studio (schema dropdown → `estacion33`)

## To do (priority order)

### 1. Generate TypeScript types from schema  ·  ~5 min  ·  cheap unlock

```sh
pnpm supabase gen types typescript \
  --project-id odzqcbbnkwkwkdajtswf \
  --schema estacion33 \
  > packages/core/src/db.types.ts
```

Then re-export from `packages/core/src/index.ts` so apps can import:

```ts
import type { Database } from '@estacion33/core';
const supabase = createClient<Database>(url, key, { db: { schema: 'estacion33' } });
```

Re-run the gen command whenever schema changes. Add to `package.json` as a script:

```json
"db:types": "supabase gen types typescript --project-id odzqcbbnkwkwkdajtswf --schema estacion33 > packages/core/src/db.types.ts"
```

### 2. Seed the menu  ·  ~30 min  ·  needs cross-check vs menu photo

Source of truth (in priority): the printed menu photo Aldo shared in chat,
then `docs/menu-seed.md`. Cross-check item names + prices before writing the
migration.

Categories (sort_order in parens):
1. Snacks
2. Nuestras Burgers
3. Las Creativas
4. Las de Chicken
5. Ensaladas
6. Italianísimos
7. Bebidas
8. Extras

Output: `supabase/migrations/<ts>_seed_menu.sql` with `insert ... on conflict do nothing` so it's idempotent. Prices in **MXN cents** (`base_price_cents`). Options:

- Boneless: sabor (BBQ, Mango Habanero, …)
- Burgers: tipo de queso (amarillo, manchego), extras (tocino +$10, mezcalada +$15, doble carne, etc.)
- Las de Chicken: sabor de boneless

### 3. MercadoPago edge functions  ·  ~1 hr  ·  blocks paid orders

Need from Aldo:
- MercadoPago **TEST** access token (Mexico account)
- Webhook signing secret

**Function: `mercadopago-create-preference`**
- Input: `{ orderId: uuid }`
- Reads `estacion33.orders` + `order_items` via `service_role`
- POSTs to MP `/checkout/preferences` with items, back-URLs, external_reference=orderId
- Returns `{ initPoint: string }` for the client to redirect
- Persists `mp_preference_id` on the order

**Function: `mercadopago-webhook`**
- Verifies signature header against secret (HMAC SHA256 over raw body)
- For `payment.created` / `payment.updated` events, fetches payment by id
- Marks order `status=paid` + `payment_status=paid` + `mp_payment_id`
- Awards loyalty points (1 point per $10 MXN)
- Idempotent on `mp_payment_id`

**Local dev:** `pnpm supabase functions serve mercadopago-webhook` + ngrok tunnel for MP to reach.

### 4. Misc follow-ups (after the big 3)

- [ ] Reservation confirmation email (Resend or Supabase email) edge function
- [ ] Storage bucket `menu-images/` with public-read RLS for product photos
- [ ] Realtime subscription on `orders.status` for the customer's active order
- [ ] Backups: enable nightly logical backup (Pro plan)
- [ ] Admin role: a `is_admin` claim or `admin_users` table for the Phase 4 admin UI

## Migration to dedicated project (later, post-launch)

Single-shot per `supabase/README.md` § "Migration to a dedicated project":
`pg_dump --schema=estacion33` → `sed` to rename schema → `psql` restore. ~30 min.

Don't do this until paying customers exist; the shared setup is fine for build + beta.
