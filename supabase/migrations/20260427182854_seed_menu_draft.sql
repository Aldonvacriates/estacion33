-- Estación 33 — DRAFT menu seed.
--
-- Source: docs/menu-seed.md (April 2026 menu image transcription).
-- Several items have unresolved prices/names — see open questions in
-- that doc. To stay safe, EVERY product is inserted with available=false
-- so the customer site can't render wrong prices. Flip items to
-- available=true (and fix prices) as the owner confirms each one.
--
-- Idempotent: re-running this migration via `on conflict do nothing` is
-- a no-op. To update an existing item, write a new migration.
--
-- Prices are MXN cents.

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
insert into estacion33.categories (slug, name, sort_order) values
  ('snacks',           'Snacks',           1),
  ('nuestras-burgers', 'Nuestras Burgers', 2),
  ('las-creativas',    'Las Creativas',    3),
  ('las-de-chicken',   'Las de Chicken',   4),
  ('ensaladas',        'Ensaladas',        5),
  ('italianisimos',    'Italianísimos',    6),
  ('bebidas',          'Bebidas',          7),
  ('extras',           'Extras',           8)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Products — all available=false until owner confirms each price.
--
-- Pattern: (select id from estacion33.categories where slug = '<x>')
-- gives a stable category reference without hardcoding UUIDs.
-- ---------------------------------------------------------------------------

-- Snacks
insert into estacion33.products
  (category_id, slug, name, description, base_price_cents, sort_order, available)
values
  ((select id from estacion33.categories where slug='snacks'),
   'boneless', 'Boneless',
   'Naturales / Búfalo / BBQ / Mango Habanero. Acompañados de tamarindo, apio y aderezo. Con papas a la francesa.',
   13500, 1, false),
  ((select id from estacion33.categories where slug='snacks'),
   'aros-de-cebolla', 'Aros de Cebolla',
   'Acompañados de aderezo.',
   7500, 2, false),
  ((select id from estacion33.categories where slug='snacks'),
   'papas-a-la-francesa', 'Papas a la Francesa',
   'Queso gratinado opcional.',
   5200, 3, false),
  ((select id from estacion33.categories where slug='snacks'),
   'papas-locas', 'Papas Locas',
   'Bañadas con queso, cátsup y salsa búfalo.',
   7500, 4, false),
  ((select id from estacion33.categories where slug='snacks'),
   'papas-demon', 'Papas Demon',
   'Papas con carne, queso y salsa búfalo.',
   9000, 5, false)
on conflict (slug) do nothing;

-- Nuestras Burgers
insert into estacion33.products
  (category_id, slug, name, description, base_price_cents, sort_order, available)
values
  ((select id from estacion33.categories where slug='nuestras-burgers'),
   'la-casa', 'La Casa',
   'Carne, jitomate, cebolla, lechuga y nuestros aderezos.',
   0, 1, false),  -- TBD price
  ((select id from estacion33.categories where slug='nuestras-burgers'),
   'clasica-con-queso', 'Clásica con Queso',
   'Carne, queso americano o manchego.',
   9900, 2, false),
  ((select id from estacion33.categories where slug='nuestras-burgers'),
   'americana', 'Americana',
   'Carne, queso americano, tocino, pepinillos, aderezo de la casa.',
   12900, 3, false),
  ((select id from estacion33.categories where slug='nuestras-burgers'),
   'hawaiana', 'Hawaiana',
   'Carne, piña, jamón, queso americano.',
   13500, 4, false),
  ((select id from estacion33.categories where slug='nuestras-burgers'),
   'doble-burger', 'Doble Burger',
   'Doble carne, doble queso.',
   15900, 5, false)
on conflict (slug) do nothing;

-- Las Creativas
insert into estacion33.products
  (category_id, slug, name, description, base_price_cents, sort_order, available)
values
  ((select id from estacion33.categories where slug='las-creativas'),
   'bonita-b', 'Bonita B',
   'Carne, piña, jamón, tocino, queso americano y salsa mango habanero.',
   13500, 1, false),
  ((select id from estacion33.categories where slug='las-creativas'),
   'popeye', 'Popeye',
   'Carne, tocino, jamón, queso americano.',
   13000, 2, false),
  ((select id from estacion33.categories where slug='las-creativas'),
   'iguana-especial', 'Iguana Especial',
   'Carne, queso, tocino.',
   13500, 3, false),
  ((select id from estacion33.categories where slug='las-creativas'),
   'avoco', 'Avoco',
   'Carne, queso americano, aguacate, jalapeños, tocino y aros de cebolla.',
   13500, 4, false),
  ((select id from estacion33.categories where slug='las-creativas'),
   'rodeo', 'Rodeo',
   'Carne, tocino y salsa BBQ.',
   13500, 5, false),
  ((select id from estacion33.categories where slug='las-creativas'),
   'buffalo', 'Buffalo',
   'Carne, tocino, salsa picante de alitas.',
   13000, 6, false),
  ((select id from estacion33.categories where slug='las-creativas'),
   'texas', 'Texas',
   'Carne, queso, tocino, aros de cebolla y salsa BBQ.',
   14000, 7, false),
  ((select id from estacion33.categories where slug='las-creativas'),
   'tocino-mezcalado', 'Tocino Mezcalado',
   'Carne, queso, tocino, mezcalada.',
   13500, 8, false),
  ((select id from estacion33.categories where slug='las-creativas'),
   'texas-doble', 'Texas Doble',
   'Doble carne, doble queso, tocino, salsa BBQ, aros de cebolla y salsa habanero.',
   13500, 9, false),
  ((select id from estacion33.categories where slug='las-creativas'),
   'boneless-burger', 'Boneless Burger',
   'Boneless bañado en salsa de queso cheddar búfalo.',
   13500, 10, false)
on conflict (slug) do nothing;

-- Las de Chicken
insert into estacion33.products
  (category_id, slug, name, description, base_price_cents, sort_order, available)
values
  ((select id from estacion33.categories where slug='las-de-chicken'),
   'pollo-grill', 'Pollo Grill',
   'Pollo, queso manchego.',
   11500, 1, false),
  ((select id from estacion33.categories where slug='las-de-chicken'),
   'pollo-grill-especial', 'Pollo Grill Especial',
   'Pollo, queso manchego (con extras — TBD por dueño).',
   12500, 2, false),
  ((select id from estacion33.categories where slug='las-de-chicken'),
   'club-burger', 'Club Burger',
   'Pollo, queso manchego, tocino, jamón.',
   13000, 3, false),
  ((select id from estacion33.categories where slug='las-de-chicken'),
   'mazahua-pollo-grill', 'Mazahua / Pollo Grill',
   'Pollo, tocino, queso manchego, mezcalada.',
   13500, 4, false)
on conflict (slug) do nothing;

-- Ensaladas
insert into estacion33.products
  (category_id, slug, name, description, base_price_cents, sort_order, available)
values
  ((select id from estacion33.categories where slug='ensaladas'),
   'ensalada', 'Ensalada',
   'Mix de lechugas, jitomate, cebolla y aderezo de la casa.',
   13500, 1, false)
on conflict (slug) do nothing;

-- Italianísimos
insert into estacion33.products
  (category_id, slug, name, description, base_price_cents, sort_order, available)
values
  ((select id from estacion33.categories where slug='italianisimos'),
   'lasana', 'Lasaña',
   'Capas de pasta, salsa boloñesa, mezcla de quesos, horneado con mozzarella.',
   13000, 1, false),
  ((select id from estacion33.categories where slug='italianisimos'),
   'pasta-al-pepperoni', 'Pasta al Pepperoni',
   'Pasta, salsa de tomate, pepperoni, mozzarella y parmesano.',
   13000, 2, false),
  ((select id from estacion33.categories where slug='italianisimos'),
   'pasta-a-la-bolonesa', 'Pasta a la Boloñesa',
   'Espagueti con salsa boloñesa, parmesano.',
   19000, 3, false),
  ((select id from estacion33.categories where slug='italianisimos'),
   'pasta-con-camarones', 'Pasta con Camarones',
   'TBD — confirmar nombre exacto con dueño.',
   19000, 4, false)
on conflict (slug) do nothing;

-- Bebidas
insert into estacion33.products
  (category_id, slug, name, description, base_price_cents, sort_order, available)
values
  ((select id from estacion33.categories where slug='bebidas'),
   'malteada-fresa', 'Malteada de Fresa',
   null, 7000, 1, false),
  ((select id from estacion33.categories where slug='bebidas'),
   'malteada-capuccino', 'Malteada de Capuccino',
   null, 7000, 2, false),
  ((select id from estacion33.categories where slug='bebidas'),
   'affogato', 'Affogato',
   'Helado de vainilla bañado con espresso.',
   6500, 3, false),
  ((select id from estacion33.categories where slug='bebidas'),
   'capuccino-caliente', 'Capuccino caliente',
   null, 4500, 4, false),
  ((select id from estacion33.categories where slug='bebidas'),
   'coca-cola-600', 'Coca-Cola 600 ml',
   null, 3200, 5, false),
  ((select id from estacion33.categories where slug='bebidas'),
   'naranjada-mineral-600', 'Naranjada Mineral 600 ml',
   null, 3200, 6, false),
  ((select id from estacion33.categories where slug='bebidas'),
   'limonada-mineral-600', 'Limonada Mineral 600 ml',
   null, 3200, 7, false),
  ((select id from estacion33.categories where slug='bebidas'),
   'sidral-mundet-600', 'Sidral Mundet 600 ml',
   null, 3200, 8, false),
  ((select id from estacion33.categories where slug='bebidas'),
   'agua-natural-500', 'Agua Natural 1/2 L',
   null, 2000, 9, false),
  ((select id from estacion33.categories where slug='bebidas'),
   'agua-natural-600', 'Agua Natural 600 ml',
   null, 2500, 10, false),
  ((select id from estacion33.categories where slug='bebidas'),
   'jugo-con-miel', 'Jugo con miel',
   null, 2000, 11, false)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Product options
-- ---------------------------------------------------------------------------

-- Boneless: sabor (single, required)
insert into estacion33.product_options (product_id, name, required, multi, sort_order)
values
  ((select id from estacion33.products where slug='boneless'), 'Sabor', true, false, 1)
on conflict do nothing;

insert into estacion33.option_values (option_id, name, price_delta_cents, sort_order)
select po.id, v.name, 0, v.sort
from estacion33.product_options po,
     (values
        ('Naturales',      1),
        ('Búfalo',         2),
        ('BBQ',            3),
        ('Mango Habanero', 4)
     ) as v(name, sort)
where po.product_id = (select id from estacion33.products where slug='boneless')
  and po.name = 'Sabor'
  and not exists (
    select 1 from estacion33.option_values ov
    where ov.option_id = po.id and ov.name = v.name
  );

-- Clásica con Queso: tipo de queso (single, required)
insert into estacion33.product_options (product_id, name, required, multi, sort_order)
values
  ((select id from estacion33.products where slug='clasica-con-queso'), 'Tipo de queso', true, false, 1)
on conflict do nothing;

insert into estacion33.option_values (option_id, name, price_delta_cents, sort_order)
select po.id, v.name, 0, v.sort
from estacion33.product_options po,
     (values
        ('Americano', 1),
        ('Manchego',  2)
     ) as v(name, sort)
where po.product_id = (select id from estacion33.products where slug='clasica-con-queso')
  and po.name = 'Tipo de queso'
  and not exists (
    select 1 from estacion33.option_values ov
    where ov.option_id = po.id and ov.name = v.name
  );

-- Ensalada: proteína (single, required) — adds to base price
insert into estacion33.product_options (product_id, name, required, multi, sort_order)
values
  ((select id from estacion33.products where slug='ensalada'), 'Proteína', true, false, 1)
on conflict do nothing;

insert into estacion33.option_values (option_id, name, price_delta_cents, sort_order)
select po.id, v.name, v.delta, v.sort
from estacion33.product_options po,
     (values
        ('Boneless',   0,    1),
        ('Pollo',      0,    2),
        ('Arrachera',  3400, 3),
        ('Camarones',  5400, 4)
     ) as v(name, delta, sort)
where po.product_id = (select id from estacion33.products where slug='ensalada')
  and po.name = 'Proteína'
  and not exists (
    select 1 from estacion33.option_values ov
    where ov.option_id = po.id and ov.name = v.name
  );

-- Burger extras (multi, optional) — applied to all "Nuestras Burgers" + "Las Creativas".
-- One option group per product so the UI is consistent.
insert into estacion33.product_options (product_id, name, required, multi, sort_order)
select p.id, 'Extras', false, true, 9
from estacion33.products p
join estacion33.categories c on c.id = p.category_id
where c.slug in ('nuestras-burgers', 'las-creativas')
  and not exists (
    select 1 from estacion33.product_options po
    where po.product_id = p.id and po.name = 'Extras'
  );

insert into estacion33.option_values (option_id, name, price_delta_cents, sort_order)
select po.id, v.name, v.delta, v.sort
from estacion33.product_options po
join estacion33.products p on p.id = po.product_id
join estacion33.categories c on c.id = p.category_id,
     (values
        ('Queso',      1000, 1),
        ('Tocino',     1000, 2),
        ('Piña',       1000, 3),
        ('Jamón',      1000, 4),
        ('Mezcalada',  1500, 5)
     ) as v(name, delta, sort)
where c.slug in ('nuestras-burgers', 'las-creativas')
  and po.name = 'Extras'
  and not exists (
    select 1 from estacion33.option_values ov
    where ov.option_id = po.id and ov.name = v.name
  );
