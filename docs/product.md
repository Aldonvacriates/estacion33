# Estación 33 — Product brief (v1)

## What it is

A Spanish-language burger restaurant in Mexico, serving hamburgers, boneless
chicken wings, fries, salads, pasta ("Italianísimos"), and drinks. Dine-in
and **Servicio a Domicilio** (delivery). Walk-up counter ordering today;
no online presence beyond a template website.

## Real-world facts (from current menu)

| | |
|---|---|
| **Hours** | Thursday, Friday, Saturday — 18:30 to 22:30 (only) |
| **Location** | Plan de Iguala s/n, Col. Burócrata (a la vuelta de Casa Mateo) |
| **Country / currency** | Mexico — MXN |
| **Languages** | Spanish only at v1 |
| **Service modes** | Dine-in + delivery |
| **Categories** | Snacks, Burgers (Nuestras + Las Creativas + Las de Chicken), Ensaladas, Italianísimos, Bebidas, Extras |
| **Price range** | ~$20 (water) to ~$190 (shrimp pasta) MXN |

The narrow operating window (3 days / 4 hours) is the single most important
constraint for the app design.

## Users + jobs

**Walk-up customer (in person)** — sees the menu on their phone, decides
faster, sometimes pays online to skip the line.

**Delivery customer (at home)** — opens the app on Friday at 19:00, picks
food, pays with MercadoPago, watches order status, eats.

**Returning regular** — has saved address + payment, orders the same combo
in three taps, earns loyalty points.

**Group host** — books a table for 6 on a Saturday, gets a confirmation,
shows up.

**Restaurant operator (admin)** — sees live orders on a tablet behind the
counter, flips status (recibido → preparación → listo → entregado),
updates the menu when a dish runs out, sees today's reservations.

## v1 scope

- Menu browsing (categories, items, options, prices in MXN)
- Online ordering: cart, checkout, delivery vs pickup, **time-slot picker
  constrained to Thu/Fri/Sat 18:30–22:30**
- MercadoPago payment
- Order status tracking + push notifications (mobile)
- Table reservations (date + time slot + party size)
- Customer accounts (email + magic link), saved addresses, order history
- Loyalty points (1 point per peso spent, redeemable later)
- Admin: live orders dashboard + menu CRUD + reservations list

## Non-goals (v1)

- Multiple locations
- Driver app / driver tracking
- Marketing automation, email campaigns
- Multi-language UI (English) — structure for it, ship Spanish only
- POS / cash register integration
- Inventory tracking beyond a simple "agotado" flag per item

## Hours-driven UX rules

These exist because the restaurant is closed 4 of 7 days:

- **When closed** — every screen shows a "Cerrado" banner with the next
  opening time ("Abrimos el viernes a las 18:30"). Cart is preserved but
  checkout is disabled.
- **Pre-opening (T-30min)** — banner switches to "Abrimos en 30 min";
  scheduled orders for the opening slot become available.
- **Open** — normal flow, time-slot picker offers slots in 15-min
  increments until 22:00 (last delivery 22:30).
- **Last call (T-30min before close)** — banner: "Última hora para
  ordenar". Slots beyond 22:30 disappear.
- **Reservations** — only for Thu/Fri/Sat between 18:30 and 22:00.

Implementation: a single `getServiceWindow(now: Date)` helper in
`@aldowebsitellc/core` returns `{ status, nextOpenAt, lastSlotAt }` and
drives every banner, picker, and disabled-state.

## Three golden flows (must work end-to-end before v1 ships)

1. **Order delivery** — Home → Menu → Burger detail (with cheese option)
   → Add to cart → Cart → Checkout (delivery, address, time slot, notes)
   → MercadoPago → Confirmation → Tracking screen.
2. **Reserve a table** — Home → Reservar → Date/time/party size/contact →
   Confirmation (+ email).
3. **Returning customer reorder** — Sign in → Order history → Reorder →
   Pay → Confirmation.

## Open questions for the owner

- Is delivery in-house, third-party (Uber Eats / Rappi / DiDi Food), or
  both? Affects the order schema and tracking UX.
- Delivery zone? (radius from Plan de Iguala, or specific neighborhoods?)
- Loyalty rules: 1 pt per peso? Redemption rate? Expiry?
- Confirm exact Estación 33 logo + acceptable photography style.
- Confirm operating hours don't change on holidays.
