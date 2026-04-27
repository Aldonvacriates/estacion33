# Menu seed — Estación 33

Source: menu image provided by the owner (April 2026).
Currency: **MXN**. All prices below are in pesos. Items marked **TBD**
need price confirmation from the owner before going into production.

This is the source of truth for `supabase/seed.sql` in Phase 3 and for the
Figma menu screens in Phase 1.

## Schema notes (informs Phase 3 migrations)

- `categories(slug, name, position)`
- `products(slug, category_id, name, description, base_price_cents, image_url, available bool)`
- `product_options(product_id, name, type: 'single' | 'multi', required bool)`
   - e.g. "Sabor del boneless" — single, required
   - e.g. "Extras" — multi, optional
- `option_values(option_id, name, price_delta_cents)`
   - e.g. "Búfalo" / "BBQ" / "Mango Habanero" / "Naturales" — `delta = 0`
   - e.g. "Queso gratinado" — `delta = 0` (option already free per menu)
   - e.g. "Tocino" extra — `delta = 1000` (i.e. $10 MXN)

Prices are stored in **cents** (`integer`) to avoid float math:
`$135.00 → 13500`.

## Categories

| slug | name | position |
|---|---|---|
| snacks | Snacks | 1 |
| nuestras-burgers | Nuestras Burgers | 2 |
| las-creativas | Las Creativas | 3 |
| las-de-chicken | Las de Chicken | 4 |
| ensaladas | Ensaladas | 5 |
| italianisimos | Italianísimos | 6 |
| bebidas | Bebidas | 7 |
| extras | Extras | 8 |

## Snacks

| Item | Price | Description |
|---|---:|---|
| Boneless | $135 | Naturales / Búfalo / BBQ / Mango Habanero. Acompañados de tamarindo, apio y aderezo. Con papas a la francesa. |
| Aros de Cebolla | $75 | Acompañados de aderezo. |
| Papas a la Francesa | $52 | Queso gratinado opcional. |
| Papas Locas | $75 | Bañadas con queso, cátsup y salsa búfalo. |
| Papas Demon | $90 | Papas con carne, queso y salsa búfalo. |

**Boneless** has a required option group: *Sabor* (Naturales / Búfalo /
BBQ / Mango Habanero), single-select.

## Nuestras Burgers

> Todas las hamburguesas incluyen papas a la francesa. **Con queso opcional.**

| Item | Price | Description |
|---|---:|---|
| La Casa | TBD | Carne, jitomate, cebolla, lechuga y nuestros aderezos. |
| Clásica con Queso | $99 | Carne, queso americano o manchego. |
| Americana | $129 | Carne, queso americano, tocino, pepinillos, aderezo de la casa. |
| Hawaiana | $135 | Carne, piña, jamón, queso americano. |
| Doble Burger | $159 | Doble carne, doble queso. |

**Clásica con Queso** has a required option *Tipo de queso* (Americano /
Manchego), single-select.

## Las Creativas

| Item | Price | Description |
|---|---:|---|
| Bonita B | $135 | Carne, piña, jamón, tocino, queso americano y salsa mango habanero. |
| Popeye | $130 | Carne, tocino, jamón, queso americano. |
| Iguana Especial | $135 | Carne, queso, tocino. |
| Avoco | $135 | Carne, queso americano, aguacate, jalapeños, tocino y aros de cebolla. |
| Rodeo | $135 | Carne, tocino y salsa BBQ. |
| Buffalo | $130 | Carne, tocino, salsa picante de alitas. |
| Texas | $140 | Carne, queso, tocino, aros de cebolla y salsa BBQ. |
| Tocino Mezcalado | $135 | Carne, queso, tocino, mezcalada. |
| Texas Doble | $135 | Doble carne, doble queso, tocino, salsa BBQ, aros de cebolla y salsa habanero. |
| Boneless Burger | $135 | Boneless bañado en salsa de queso cheddar búfalo. |

> Note: the menu image shows two items both labeled "Texas" at $140 and
> $135. Treating the cheaper one as **Texas Doble**. **Owner to confirm.**

## Las de Chicken

| Item | Price | Description |
|---|---:|---|
| Pollo Grill | $115 | Pollo, queso manchego. |
| Pollo Grill Especial | $125 | Pollo, queso manchego (con extras — owner to confirm). |
| Club Burger | $130 | Pollo, queso manchego, tocino, jamón. |
| Mazahua / Pollo Grill | $135 | Pollo, tocino, queso manchego, mezcalada. |

## Ensaladas

| Item | Price | Description |
|---|---:|---|
| Ensalada | $135 | Mix de lechugas, jitomate, cebolla y aderezo de la casa. |

**Add-on protein** (option group on the salad):

| Proteína | Price delta |
|---|---:|
| Boneless | $0 (incluido) |
| Pollo | $0 |
| Arrachera | +$34 (total $169) |
| Camarones | +$54 (total $189) |

(Confirm with owner whether any of these are "instead of" the base
price — currently modeled as deltas from $135.)

## Italianísimos

| Item | Price | Description |
|---|---:|---|
| Lasaña | $130 | Capas de pasta, salsa boloñesa, mezcla de quesos, horneado con mozzarella. |
| Pasta al Pepperoni | $130 | Pasta, salsa de tomate, pepperoni, mozzarella y parmesano. |
| Pasta al Pesto | TBD | (Confirm — couldn't read clearly.) |
| Pasta a la Boloñesa | $190 | Espagueti con salsa boloñesa, parmesano. |
| Pasta con Camarones | $190 | (Owner to confirm exact name.) |

## Bebidas

| Item | Price | Notes |
|---|---:|---|
| Malteada de Fresa | $70 | |
| Malteada de Capuccino | $70 | |
| Affogato | $65 | Helado de vainilla bañado con espresso. |
| Capuccino caliente | $45 | |
| Coca-Cola 600 ml | $32 | |
| Naranjada Mineral 600 ml | $32 | |
| Limonada Mineral 600 ml | $32 | |
| Sidral Mundet 600 ml | $32 | |
| Agua Natural 1/2 L | $20 | |
| Agua Natural 600 ml | $25 | |
| Jugo con miel | $20 | |

## Extras (option deltas, selectable on burgers)

| Extra | Price |
|---|---:|
| Queso | +$10 |
| Tocino | +$10 |
| Piña | +$10 |
| Jamón | +$10 |
| Mezcalada | +$15 |

## Open questions (block production seed)

1. Confirm "La Casa" burger price.
2. Confirm second "Texas" item — different name?
3. Confirm Italianísimos pasta names + prices (image partially unclear).
4. Confirm Ensalada protein delta logic (add-on vs. replace base).
5. Confirm Pollo Grill Especial differentiator vs. plain Pollo Grill.
6. Final dish photos — current site uses Swigo stock; need real Estación 33
   photography for menu.
