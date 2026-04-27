# Figma spec — Estación 33

A Figma-ready spec for designing the Estación 33 web + mobile app. Pair
this with `docs/figma/tokens.json` (Tokens Studio plugin compatible).

## Setup checklist

1. Create file: **"Estación 33 — Aldo Website LLC"** (Figma project: Aldo Website LLC).
2. Install plugins: **Tokens Studio for Figma**, **Iconify**, **Auto Layout**, **Content Reel**.
3. Tokens Studio → Settings → Add token set → upload `docs/figma/tokens.json`.
4. Apply tokens: Tokens Studio → Apply → "Create styles" (color + typography → Figma styles).
5. Add Poppins via Google Fonts (weights 400 / 500 / 600 / 700 / 900).
6. Set up the page list below.
7. Build components on the **🧩 Components** page first; reuse everywhere.
8. Save the public share link in `docs/figma-link.md` (a placeholder file —
   add the link there when the file exists).

## Pages (in this order)

| # | Page | Purpose |
|---|---|---|
| 1 | 🎨 Cover | File cover, project meta, last-updated |
| 2 | 🗺️ IA + Sitemap | All routes, both apps |
| 3 | 🌊 User Flows | The three golden flows + edge cases |
| 4 | 🎨 Design System | Colors, type, spacing, radii, shadow, iconography |
| 5 | 🧩 Components | All reusable components, with variants |
| 6 | 📱 Mobile — Public | Home, Menu, Product, About, Contact, Gallery, FAQ |
| 7 | 📱 Mobile — Ordering | Cart, Checkout, Pay, Confirm, Tracking |
| 8 | 📱 Mobile — Reservar | Reservation form + confirm |
| 9 | 📱 Mobile — Cuenta | Sign in, Profile, Addresses, Orders, Loyalty |
| 10 | 🖥️ Web — Public | Same set, desktop layouts |
| 11 | 🖥️ Web — Ordering | Same set, desktop layouts |
| 12 | 🖥️ Web — Reservar | Same set, desktop layouts |
| 13 | 🖥️ Web — Cuenta | Same set, desktop layouts |
| 14 | 🖥️ Web — Admin | Orders dashboard, Menu CRUD, Reservations |
| 15 | 🧪 Explorations | Throwaway sketches, archive |

## Frame sizes

| Surface | Frame | Notes |
|---|---|---|
| Mobile | **390 × 844** | iPhone 15 portrait reference |
| Tablet | 768 × 1024 | optional, only Home + Menu + Checkout |
| Web small | 375 × auto | mobile web, mirrors Mobile but adapts to web nav |
| Web | **1440 × auto** | desktop reference |
| Web max | 1920 × auto | sanity check at the high end |

Container max width on desktop: **1280**. Outer gutters: **24** (mobile) / **48** (desktop).

## Grid

- Mobile: 4-column, 16 gutter, 16 margin.
- Desktop: 12-column, 24 gutter, 48 margin.
- Vertical rhythm: spacing scale from tokens (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96).

---

## Iconography

Use **Lucide** via Iconify plugin. Sizes: 16, 20, 24, 32. Stroke 1.75. Color
inherits from text style. Common icons: `home`, `utensils`, `shopping-cart`,
`user`, `map-pin`, `clock`, `check`, `x`, `chevron-right`, `bell`,
`credit-card`, `phone`, `instagram`, `facebook`, `whatsapp` (custom).

---

## Components (build these first on the 🧩 Components page)

Each is a Figma component with **variants**. Use Auto Layout everywhere.
Wire properties to tokens (no hard-coded values).

### Button
- **Variants**: `variant = primary | secondary | ghost | danger`, `size = sm | md | lg`, `state = default | hover | active | disabled | loading`, `iconLeft = bool`, `iconRight = bool`.
- Heights: 32 / 40 / 48 (per `size.button*`). Padding-X: 12 / 16 / 20.
- Radius: `borderRadius.md` (8). Pill variant uses `pill`.
- Type style: `typography.buttonLg`.
- **Primary**: bg `brand/primary`, text `text/onPrimary`, hover bg `brand/primaryHover`.
- **Secondary**: bg transparent, border 1.5 `brand/primary`, text `brand/primary`.
- **Ghost**: text only, hover bg `neutral/100`.
- **Danger**: bg `semantic/danger`, text white.

### IconButton
- Square 40 / 48. Same color variants as Button.

### Input (text)
- Variants: `state = default | focus | error | disabled`, `hasLabel`, `hasHelper`, `hasIcon`.
- Height 44. Padding-X 12. Radius `md`. Border 1 `surface/border`. Focus border 2 `brand/primary`.
- Label: `typography.label` above, 4 spacing.
- Helper / error: `typography.caption` below, 4 spacing.

### Select / Dropdown
- Same skin as Input, with chevron-down icon-right.

### Stepper (qty)
- `−` `n` `+` controls, height 40. Used on cart line items + product detail "agregar X".

### Checkbox / Radio
- 20×20 box, 2 border, checked bg `brand/primary`, white check icon.

### Tag / Badge
- Pill, padding 4×8, `typography.label`. Variants: `neutral`, `success`, `warning`, `danger`, `brand`. Used for "AGOTADO", "NUEVO", "PICANTE", order status.

### ServiceWindowBanner ⚠️ key component
Renders one of four states from `getServiceWindow()`:
- **closed** — bg `semantic/dangerBg`, icon `clock`, text "Cerrado · abrimos el viernes 18:30".
- **pre-open** — bg `semantic/warningBg`, "Abrimos en 30 min".
- **open** — `semantic/successBg`, "Abierto · cerramos a las 22:30".
- **last-call** — `brand/secondary` bg, white text, "Última hora para ordenar".
Sticky under the app bar on mobile, top-of-page on web.

### Card — ProductCard
- Image (square 1:1, radius `md`, object-cover), title (`h4`), short desc (`bodySm`, muted, 2-line clamp), price (`typography.price`, `brand/primary`), "Agregar" button-sm.
- Variants: `layout = grid | list`, `state = default | sold-out` (image grayscale + "AGOTADO" tag).

### Card — CartLineItem
- Thumb 64×64, title + options in `bodySm`, qty stepper, line total, trash icon.

### Card — OrderStatus
- Big status pill, ETA, address, line items collapsed. Used on order tracking.

### Card — AddressCard
- Label (Casa, Oficina, etc.), street, "Editar" / "Eliminar" actions, radio for "use this".

### TimeSlotPicker
- Date strip (Thu/Fri/Sat for next 2 weeks; gray-out other days).
- Time chips at 15-min increments from 18:30 to 22:30. Selected uses `brand/primary` bg.

### LoyaltyPill
- Star icon + "X puntos". Background `brand/secondary50`, text `brand/secondary700`.

### AppBar (mobile)
- Height 56. Logo center, IconButton left (back / menu), IconButton right (cart with badge).

### BottomNav (mobile)
- Height 64. 4 tabs: **Inicio · Menú · Carrito · Cuenta**. Active uses `brand/primary` filled icon, inactive `neutral/500` outline.

### TopNav (web)
- Height 80. Logo left, links center (Menú · Reservar · Contacto), right side: Cart, Sign in / Avatar.

### Footer (web)
- 3 cols: brand + tagline, hours + address, links + social. Bottom bar: © Estación 33 · Hecho por Aldo Website LLC.

### Toast
- Top-right desktop / top-mobile. Variants: success / error / info. Auto-dismiss 4s.

### BottomSheet (mobile) / Modal (web)
- Used for: product detail (mobile), filter, address picker, sign-in.

### EmptyState
- Lucide icon (48), `h3` headline, `body` muted subtext, optional CTA Button.

### Skeleton
- Shimmer rect, used on product grid + order tracking while loading.

### CategoryChips
- Horizontal scroll on mobile. Pill chips, selected = `brand/primary`. Used on Menu screen.

---

## Screens

Notation: `[mobile · web]`. ASCII shows mobile portrait. Desktop notes follow.

### Home

```
┌──────────────────────┐
│ AppBar               │
├──────────────────────┤
│ ServiceWindowBanner  │
├──────────────────────┤
│ HERO  (photo+headline│
│ "Hamburguesas hechas │
│ con carbón hirviente"│
│ [Ver Menú] [Reservar]│
├──────────────────────┤
│ Categorías (chips)   │
│ Snacks Burgers …     │
├──────────────────────┤
│ Destacados (3 cards) │
│ Clásica · Boneless · │
│ Texas                │
├──────────────────────┤
│ Italianísimos strip  │
│ "Disfruta el sabor   │
│ de la comida ital."  │
├──────────────────────┤
│ Reserva tu mesa CTA  │
├──────────────────────┤
│ Ubicación + horarios │
│ map preview + botón  │
│ "Cómo llegar"        │
├──────────────────────┤
│ BottomNav (Inicio)   │
└──────────────────────┘
```
**Web**: hero spans 100%, two-column featured grid, Italianísimos becomes a full-bleed band, footer below.

### Menu

```
┌──────────────────────┐
│ AppBar [search] cart │
├──────────────────────┤
│ ServiceWindowBanner  │
├──────────────────────┤
│ CategoryChips ────►  │
├──────────────────────┤
│  ProductCard grid    │
│  2 cols mobile       │
│                      │
│  (sticky category    │
│   subhead while you  │
│   scroll)            │
└──────────────────────┘
```
States: filtering by category, search, item agotado, empty (when category empty).
**Web**: 3-col on tablet, 4-col on desktop. Category sidebar on the left from `lg` up.

### Product detail

```
┌──────────────────────┐
│ ← back        ❤  ⤴   │
├──────────────────────┤
│ HERO photo (4:3)     │
├──────────────────────┤
│ Boneless        $135 │
│ Naturales / Búfalo / │
│ BBQ / Mango Habanero │
├──────────────────────┤
│ Sabor *  (radios)    │
│ ◉ Naturales   ○ BBQ  │
│ ○ Búfalo  ○ Mango H. │
├──────────────────────┤
│ Extras (multi)       │
│ ☐ Tocino   +$10      │
│ ☐ Queso    +$10      │
│ ☐ Mezcalada +$15     │
├──────────────────────┤
│ Notas (textarea)     │
├──────────────────────┤
│ ─────────────────────│
│ Stepper [− 1 +]      │
│ [Agregar — $135]     │  ← sticky bottom bar
└──────────────────────┘
```
States: required option not yet picked → Add button disabled. Closed → Add button replaced by "Volvemos el viernes".
**Web**: split layout 50/50, photo left, options right.

### Cart

```
┌──────────────────────┐
│ ← Mi Carrito         │
├──────────────────────┤
│ CartLineItem ×N      │
├──────────────────────┤
│ Subtotal       $XYZ  │
│ Envío          $XYZ  │
│ Total          $XYZ  │
├──────────────────────┤
│ [Continuar al pago]  │
└──────────────────────┘
```
Empty state: utensil icon + "Tu carrito está vacío" + "Ver menú" button.

### Checkout

Three sections, each collapsible:
1. **Modo de entrega**: Toggle Domicilio / Recoger en sucursal.
   - Domicilio → AddressCard list + "Agregar dirección".
   - Recoger → "Plan de Iguala s/n, Col. Burócrata" map preview.
2. **Hora de entrega**: TimeSlotPicker (Thu/Fri/Sat slots only).
3. **Notas para la cocina**: textarea.

Sticky footer: Total $XYZ + **[Pagar con MercadoPago]** primary button.

### MercadoPago redirect

External (web: full redirect; mobile: in-app WebView). Spec: native WebView frame with our app bar "Pago seguro · MercadoPago" + back arrow that confirms cancel.

### Order confirmation

Hero check icon, "¡Pedido confirmado!", order number, ETA, summary, "Ver seguimiento" primary CTA.

### Order tracking

Vertical stepper (Recibido → Preparando → Listo → En camino / Entregado). Live updates via Supabase realtime. Map preview if delivery + driver later (v1.1).

### Reservar

```
┌──────────────────────┐
│ Reserva tu mesa      │
├──────────────────────┤
│ Fecha   [date strip] │ Thu/Fri/Sat only
├──────────────────────┤
│ Hora    [time chips] │ 18:30–22:00 by 15min
├──────────────────────┤
│ Personas  [stepper]  │
├──────────────────────┤
│ Nombre               │
│ Teléfono             │
│ Email (opcional)     │
│ Notas (opcional)     │
├──────────────────────┤
│ [Confirmar reserva]  │
└──────────────────────┘
```
Confirmation screen: "¡Listo! Te esperamos el [día] a las [hora]." + add-to-calendar links.

### Cuenta — Sign in
- Email field + magic link button. "También con Google" optional. After submit: empty state with mail icon "Revisa tu correo".

### Cuenta — Profile
- Avatar, name, phone, email (read-only), edit name/phone, sign-out, danger zone "Eliminar cuenta".

### Cuenta — Addresses
- List of AddressCard, "Agregar dirección" → form (label, calle, num, colonia, CP, referencias, geolocate button).

### Cuenta — Orders
- Filter chips (Todos · Activos · Entregados).
- List of order rows: date, status badge, total, "Reordenar" button.

### Cuenta — Loyalty
- Big number (puntos), progress bar to next reward, history of recent earns.

### Admin (web only)
- **Login**: gated by Supabase role `admin`.
- **Orders dashboard**: live grid of order cards by column status. Drag between columns to update status. Sound notification on new order.
- **Menu**: list of categories → items, inline toggle "agotado", edit drawer.
- **Reservations**: today + next 14 days, sortable table.

---

## User flows (build these as Figma prototypes)

### 1. Order delivery — golden flow
`Home → Menu → ProductDetail (Clásica con Queso → Manchego) → Add to cart → Cart → Checkout (Domicilio, Friday 19:30, default address) → MercadoPago → Confirmation → OrderTracking`

### 2. Reserve a table — golden flow
`Home → Reservar → Friday + 20:00 + 4 personas + name/phone → Confirm → Confirmation`

### 3. Reorder — golden flow
`SignIn → Profile → Orders → "Reordenar" on last order → Cart prefilled → Checkout → Pay → Confirm`

### Edge flows worth prototyping
- **Cerrado on Monday**: Home shows banner, Menu items show "Volvemos el viernes" instead of Add buttons.
- **Item agotado**: ProductCard grayed, ProductDetail shows "Agotado" badge.
- **Magic-link sign-in**: Sign in → check-mail empty state → return from email → Profile.

---

## Microcopy starter (Spanish)

| Spot | Copy |
|---|---|
| Hero | *"Hamburguesas hechas con carbón hirviente"* |
| Service banner — closed | *"Cerrado · abrimos el viernes a las 18:30"* |
| Service banner — open | *"Abierto · cerramos a las 22:30"* |
| Service banner — last call | *"Última hora para ordenar"* |
| Menu empty | *"No hay platillos en esta categoría"* |
| Cart empty | *"Tu carrito está vacío"* / *"Ver el menú"* |
| Add to cart success | *"Agregado al carrito"* |
| Pay button | *"Pagar con MercadoPago"* |
| Confirm header | *"¡Pedido confirmado!"* |
| Reserve confirm | *"¡Listo! Te esperamos."* |
| Magic link sent | *"Revisa tu correo, te mandamos un enlace para entrar."* |
| Generic error | *"Algo salió mal. Intenta de nuevo."* |
| Sold out | *"Agotado por hoy"* |
| Footer credit | *"Hecho por Aldo Website LLC"* |

---

## Hand-off back to code (Phase 2 trigger)

Phase 2 starts when:

1. All screens above exist at mobile (390) and web (1440) sizes.
2. All components on 🧩 Components are built with variants.
3. Tokens Studio export → committed to `packages/tokens/tokens.json` (the
   plugin's "Push to Git" mirrors `docs/figma/tokens.json`).
4. Three golden flows + the three edge flows are clickable prototypes.
5. Public read-only Figma link recorded in `docs/figma-link.md`.
