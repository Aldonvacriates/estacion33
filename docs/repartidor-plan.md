# Plan — `/repartidor` delivery driver console

## Why

Your dad will eventually have one or more delivery drivers ("repartidores")
running orders from Plan de Iguala to Iguala neighborhoods. Right now the
app is admin + customer; nobody on the road sees orders. We need a third
surface that lives between the customer's `/orden/[id]` and the admin's
`/admin/ordenes`.

The repartidor experience should feel **like Uber Eats / DiDi Food for
the driver**, not a generic admin dashboard:

- Open the app → see a list of orders ready to pick up
- Tap one → see customer name + phone + WhatsApp + address + items
- Tap **"Recoger"** → status flips to *out_for_delivery*, GPS starts
  pinging
- Drive to the customer (Maps button)
- On arrival, tap **"Tomar foto de entrega"** → upload a photo of the
  bag at the door
- Tap **"Entregado"** → status flips to *delivered*, GPS stops, final
  proof photo + timestamp saved
- Customer's `/orden/[id]` page shows the live driver location while
  in transit (the realtime channel we already have for status now also
  carries lat/lng)

## Scope decisions

### In scope (v1)
- New `repartidor` role on `profiles` (alongside `is_admin`)
- New `/repartidor` route with its own layout (own header, no public chrome)
- Driver order queue: paid + ready-to-deliver orders sorted by scheduled time
- Order detail with customer info, items, address, Maps link, WhatsApp button
- Status transitions: `paid → preparing → ready → out_for_delivery → delivered`
  (driver only owns the last two transitions; kitchen/admin owns the first three)
- Delivery proof: photo upload to a private `delivery-proofs` Supabase bucket,
  signed URL surfaced to admin only
- Live GPS: while `out_for_delivery`, the driver's browser pings location
  every 20s into a new `delivery_locations` table; the customer's order page
  subscribes via Supabase Realtime and shows a map
- Customer order page gets a small inline map showing driver location +
  ETA estimate
- Admin gets a "Repartidores" sub-page listing active drivers + their
  current order

### Explicitly out of scope (v1)
- Native app — this is web-only. Driver opens `https://www.estacion33.com/repartidor`
  on their phone, adds to home screen. No App Store distribution.
- Multi-driver dispatch / "auto-assign nearest". Driver picks orders
  manually from the queue.
- Real route optimization. We just open Google Maps with the address.
- Tip flow. Drivers get tips through the existing order total.
- Driver payout / earnings tracking. Out of scope for v1.
- Background GPS while screen is off — phones throttle aggressively, and
  fixing it needs a service worker + PWA install. v1 only pings while
  the driver tab is foreground.

## Data model changes

```
-- new role flag (matching existing is_admin pattern)
alter table estacion33.profiles
  add column is_repartidor boolean not null default false;

-- order delivery columns
alter table estacion33.orders
  add column delivery_driver_id uuid references estacion33.profiles(id),
  add column delivery_started_at timestamptz,
  add column delivery_completed_at timestamptz,
  add column delivery_proof_path text;
  -- proof_path is the storage object key; admin-only public URLs

-- live driver position pings (one row per ping, append-only)
create table estacion33.delivery_locations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references estacion33.orders(id) on delete cascade,
  driver_id uuid not null references estacion33.profiles(id),
  lat double precision not null,
  lng double precision not null,
  accuracy_m double precision,
  recorded_at timestamptz not null default now()
);
create index on estacion33.delivery_locations (order_id, recorded_at desc);

-- index for the driver's "what should I deliver next" query
create index on estacion33.orders (status, scheduled_for)
  where status in ('ready', 'out_for_delivery');
```

### RLS

- `delivery_locations`: insert allowed if `auth.uid() = driver_id` AND
  the driver owns that order. Select allowed for the driver, the customer
  who placed the order, and admins.
- `delivery-proofs` storage bucket: insert allowed if `is_repartidor`,
  read allowed for the order's customer + admins (signed URL).
- `orders` already has RLS; add a policy so repartidores can update only
  the delivery columns + status transitions `ready → out_for_delivery`
  and `out_for_delivery → delivered`.

## UI surfaces

### `/repartidor` (driver shell)
- Header: burger logo + "REPARTIDOR" Bebas wordmark, driver name on right
- "Mi cuenta" pill (same as admin) so they can leave the driver mode
- Bottom-tab nav (mobile-first): **Cola** (queue) · **Activo** (current
  order if any) · **Historial**

### `/repartidor` (queue view, default landing)
- List of orders with `status in ('ready', 'paid')` and `fulfillment = 'delivery'`
- Each card: customer first name, address line 1, scheduled time, total
- Tap card → `/repartidor/orden/[id]`

### `/repartidor/orden/[id]` (order detail + active delivery)
- Customer name + phone + green WhatsApp button (using existing
  `buildWaLink` helper)
- Full address + "Abrir en Maps" button (opens
  `https://maps.google.com/?q=<urlencoded address>`)
- Items list (read-only)
- Notes field
- **Status timeline + action button** (changes by current status):
  - `ready`     → big yellow "Iniciar entrega" (sets out_for_delivery,
                  starts GPS loop)
  - `out_for_delivery` → "Tomar foto de entrega" (camera input) +
                  "Marcar entregado" (disabled until photo uploaded)
  - `delivered` → green checkmark + photo preview + timestamp

### `/repartidor/historial`
- List of past delivered/cancelled orders for this driver, last 30 days

### `/orden/[id]` (customer-side, additions only)
- When `status = 'out_for_delivery'`, show a small live map (Leaflet +
  OpenStreetMap tiles, no API key needed) with a pulsing burger icon
  at the driver's last reported location
- Subscribes to `delivery_locations` realtime, updates marker on insert

### `/admin/repartidores` (admin sub-page, additions only)
- Roster of repartidores with toggle (`is_repartidor` on/off)
- Active deliveries: order, driver name, last ping time, distance from
  restaurant
- Lets admin reassign an order to a different driver if needed

## New server actions / route handlers

- `apps/web/app/repartidor/actions.ts`
  - `claimOrderForDeliveryAction(orderId)` — sets `delivery_driver_id`,
    transitions `ready → out_for_delivery`
  - `pingLocationAction(orderId, lat, lng, accuracy)` — inserts into
    `delivery_locations` (rate-limited server-side to 1/10s per driver)
  - `completeDeliveryAction(orderId, formData)` — uploads proof photo,
    transitions `out_for_delivery → delivered`, stamps
    `delivery_completed_at`
- All actions go through a `requireRepartidor()` helper mirroring the
  existing `requireAdmin()`

## Realtime + GPS implementation

- Driver page mounts a `useEffect` that, while the order is
  `out_for_delivery`, calls `navigator.geolocation.watchPosition` and
  every 20s POSTs the most recent reading via `pingLocationAction`
- Cleared on unmount + on status transition to `delivered`
- Customer page subscribes via existing Supabase channel
  (`orders:order_id=eq.<id>`) to status changes AND to a new
  `delivery_locations:order_id=eq.<id>` channel for position pings
- Map: `react-leaflet` + OSM tiles, ~80 KB gzipped, no API key needed

## Phasing — ship in slices

### Phase 1 — schema + role + driver shell (no GPS yet)
- Migration: `is_repartidor` column, no other tables
- `/repartidor` route + queue + order detail + Iniciar/Entregado
  buttons (status transitions only, no photo, no GPS)
- Customer `/orden/[id]` shows "En camino" status (no map yet)
- Admin can flag a profile as `is_repartidor`
- **Ship this. Test end-to-end with you + dad.**

### Phase 2 — proof photos
- Migration: `delivery_proof_path` column + `delivery-proofs` bucket
- `completeDeliveryAction` uploads photo from `<input capture="environment">`
- Customer `/orden/[id]` shows the photo after delivery
- Admin can pull the signed URL

### Phase 3 — live GPS + map
- Migration: `delivery_locations` table + RLS
- Driver page pings location every 20s while delivering
- Customer page mounts react-leaflet with live driver marker
- `/admin/repartidores` page shows active deliveries

### Phase 4 — polish (optional) ✅
- ETA estimate using haversine distance + average speed — **shipped**
- Screen wake lock so the driver phone stays awake — **shipped**
- Always-on GPS preference toggle on profile — **shipped (preference only)**
- Driver "earnings" tab — **shipped (Historial totals row)**

### Phase 5 — assignment hybrid ✅
- Admin `assignDriverAction(orderId, driverId)` — **shipped**
- "Asignar repartidor" dropdown on /admin/ordenes — **shipped**
- Live queue subscription on /repartidor (realtime → router.refresh) — **shipped**
- Audio alert chime on new ready order (per-device localStorage opt-in) — **shipped**
- Driver name on customer /orden/[id] ("Juan viene en camino") — **shipped**

### Phase 5b — PWA install groundwork ✅
- `app/manifest.ts` — Next.js manifest convention with proper icons,
  theme color, scope, shortcuts. **shipped**
- `app/apple-icon.tsx` — 180×180 generated burger icon for iOS Add to
  Home Screen. **shipped**
- `app/icon-192/route.tsx` + `app/icon-512/route.tsx` — Android/Chrome
  install criteria (192 + 512 maskable). **shipped**
- `public/sw.js` — minimal pass-through service worker registered
  driver-side only. Phase 6 swaps this for real push handlers. **shipped**
- `app/repartidor/InstallPrompt.tsx` — captures
  `beforeinstallprompt` on Chrome/Android, falls back to a textual
  Share-sheet hint on iOS, dismissible for 7 days. **shipped**
- Migration `repartidor_push_subs` (driver_id, endpoint, p256dh, auth,
  user_agent, created_at, last_used_at) — empty for now, populated
  in phase 6. **shipped**

### Phase 6 — push notifications (Option C) — deferred
Real auto-offer dispatch needs the browser to wake the driver even when
the tab is closed. That requires:
- PWA install prompt + manifest
- Service worker registration
- Web Push subscription per device, stored in `repartidor_push_subs`
- Edge function that sends a notification to all online drivers when a
  delivery order hits `ready`
- "Online" presence tracking — likely Supabase Realtime presence channel
- State machine: offered → accepted (first-come) / declined / timeout
- Fallback: if everyone declines or times out, alert admin

Worth it once the dad sees enough volume that manual dispatch hurts
(say >50 delivery orders per night) AND the kitchen has more than 1
driver actively waiting. For now the hybrid (self-serve queue + admin
manual assign + live updates + audio chime) covers small-team needs.

## Files to add (rough)

```
supabase/migrations/
  YYYYMMDDHHmm_repartidor_role.sql        # phase 1
  YYYYMMDDHHmm_delivery_proofs.sql        # phase 2
  YYYYMMDDHHmm_delivery_locations.sql     # phase 3

apps/web/app/repartidor/
  layout.tsx          # auth gate (requires is_repartidor)
  page.tsx            # queue
  actions.ts
  orden/[id]/
    page.tsx
    DeliveryControls.tsx     # 'use client', GPS + photo capture
    DeliveryStatus.tsx
  historial/
    page.tsx

apps/web/app/(public)/orden/[id]/
  DeliveryMap.tsx     # 'use client', react-leaflet
  page.tsx            # add map when status = out_for_delivery

apps/web/app/admin/repartidores/
  page.tsx
```

## Open questions to confirm before I start

1. **Driver phone / device** — drivers will open the site on their own
   phone, right? No company-issued device? (affects whether we can
   require iOS Safari + Add-to-Home-Screen)
2. **One driver or multiple?** v1 above supports multiple but needs more
   work for dispatch UI. If you only ever have one driver (your brother /
   primo) we can simplify.
3. **Tip / cash collection** — does the driver collect cash on delivery?
   If yes, we need a "Cobrado" toggle on the driver order detail.
4. **Privacy** — GPS pings stop the moment delivery completes; we never
   show driver location outside an active delivery. Is that the right
   policy or do you want admins to see drivers when idle too?
5. **Cost ceiling** — react-leaflet + OSM tiles are free. If you want
   Mapbox or Google Maps tiles, that's a key + a billing setup. Default
   is free OSM.

## Verification

After Phase 1 ships:
- Mark yourself `is_repartidor = true` via SQL or admin
- Place a test cash order, mark it `ready` from /admin/ordenes
- Open /repartidor on your phone — order should appear in the queue
- Tap into it, hit "Iniciar entrega" → /admin/ordenes shows
  out_for_delivery, customer's /orden/[id] shows "En camino"
- Tap "Entregado" → status flips to delivered everywhere

After Phase 3:
- Repeat the flow above, but on phone 2 open the customer order page
- The map should show your driver-phone's live location updating every
  20s
- Walking around should move the marker

## Estimated work

- Phase 1: ~2-3 hours (1 migration + 1 layout + 2 pages + actions)
- Phase 2: ~1 hour (storage bucket + photo capture + display)
- Phase 3: ~3-4 hours (table + RLS + driver GPS hook + customer map)
- Phase 4: optional, sized as we go
