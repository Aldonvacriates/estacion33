-- Estación 33 — initial schema.
--
-- All tables live in the `estacion33` schema so we can share the
-- `aldowecitellc` Supabase project with other Aldo Website LLC
-- products (which use `public`) until Estación 33 graduates to its
-- own project. See supabase/README.md for the migration path.
--
-- Conventions:
--   * Money is stored as integer MXN cents (no floats — kitchen math).
--   * Timestamps are timestamptz, defaulting to now() at insert.
--   * IDs are uuid generated in the DB (not the client).
--   * RLS is enabled on every table; policies follow at the bottom.

create schema if not exists estacion33;

-- gen_random_uuid() comes from pgcrypto (already enabled on Supabase).
create extension if not exists pgcrypto with schema extensions;

-- Surface the schema to PostgREST so the supabase-js client can see it.
grant usage on schema estacion33 to anon, authenticated, service_role;
alter default privileges in schema estacion33
  grant select on tables to anon, authenticated;
alter default privileges in schema estacion33
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema estacion33
  grant all on tables to service_role;

-- ---------------------------------------------------------------------------
-- 1. updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function estacion33.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. profiles — 1:1 with auth.users
-- ---------------------------------------------------------------------------
create table estacion33.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  locale text not null default 'es',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on estacion33.profiles
  for each row execute function estacion33.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. menu — categories, products, options
-- ---------------------------------------------------------------------------
create table estacion33.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table estacion33.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references estacion33.categories(id) on delete restrict,
  slug text not null unique,
  name text not null,
  description text,
  base_price_cents int not null check (base_price_cents >= 0),
  image_url text,
  available boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on estacion33.products (category_id, sort_order);

create trigger products_set_updated_at
  before update on estacion33.products
  for each row execute function estacion33.set_updated_at();

create table estacion33.product_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references estacion33.products(id) on delete cascade,
  name text not null,
  required boolean not null default false,
  multi boolean not null default false,
  sort_order int not null default 0
);

create index product_options_product_idx on estacion33.product_options (product_id);

create table estacion33.option_values (
  id uuid primary key default gen_random_uuid(),
  option_id uuid not null references estacion33.product_options(id) on delete cascade,
  name text not null,
  price_delta_cents int not null default 0,
  sort_order int not null default 0
);

create index option_values_option_idx on estacion33.option_values (option_id);

-- ---------------------------------------------------------------------------
-- 4. addresses
-- ---------------------------------------------------------------------------
create table estacion33.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text,
  line1 text not null,
  line2 text,
  city text not null default 'Mexico',
  notes text,
  lat double precision,
  lng double precision,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index addresses_user_idx on estacion33.addresses (user_id);

-- ---------------------------------------------------------------------------
-- 5. service_windows — opening hours config (driven by getServiceWindow())
-- ---------------------------------------------------------------------------
create table estacion33.service_windows (
  id uuid primary key default gen_random_uuid(),
  -- ISO weekday: 1=Mon, 7=Sun
  dow smallint not null check (dow between 1 and 7),
  opens time not null,
  closes time not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index service_windows_dow_idx
  on estacion33.service_windows (dow) where active;

-- ---------------------------------------------------------------------------
-- 6. orders + order_items
-- ---------------------------------------------------------------------------
create type estacion33.order_status as enum (
  'pending', 'paid', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'
);

create type estacion33.fulfillment_type as enum ('delivery', 'pickup');

create type estacion33.payment_status as enum ('pending', 'paid', 'failed', 'refunded');

create table estacion33.orders (
  id uuid primary key default gen_random_uuid(),
  -- Nullable: guest checkout allowed; if present, must match auth.uid() in RLS.
  user_id uuid references auth.users(id) on delete set null,
  status estacion33.order_status not null default 'pending',
  fulfillment estacion33.fulfillment_type not null,
  address_id uuid references estacion33.addresses(id) on delete set null,
  scheduled_for timestamptz not null,
  subtotal_cents int not null check (subtotal_cents >= 0),
  delivery_fee_cents int not null default 0 check (delivery_fee_cents >= 0),
  total_cents int not null check (total_cents >= 0),
  payment_status estacion33.payment_status not null default 'pending',
  mp_preference_id text,
  mp_payment_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_idx on estacion33.orders (user_id, created_at desc);
create index orders_status_idx on estacion33.orders (status, scheduled_for);

create trigger orders_set_updated_at
  before update on estacion33.orders
  for each row execute function estacion33.set_updated_at();

create table estacion33.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references estacion33.orders(id) on delete cascade,
  product_id uuid not null references estacion33.products(id) on delete restrict,
  qty int not null check (qty > 0),
  unit_price_cents int not null check (unit_price_cents >= 0),
  -- Snapshot of selected options at order time, e.g.
  -- [{ "optionId": "...", "valueIds": ["...", "..."] }]
  selected_options jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index order_items_order_idx on estacion33.order_items (order_id);

-- ---------------------------------------------------------------------------
-- 7. reservations
-- ---------------------------------------------------------------------------
create type estacion33.reservation_status as enum (
  'pending', 'confirmed', 'cancelled', 'no_show'
);

create table estacion33.reservations (
  id uuid primary key default gen_random_uuid(),
  -- Guest reservations allowed (user_id null).
  user_id uuid references auth.users(id) on delete set null,
  guest_name text not null,
  phone text not null,
  party_size smallint not null check (party_size between 1 and 20),
  slot_at timestamptz not null,
  status estacion33.reservation_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reservations_slot_idx on estacion33.reservations (slot_at);
create index reservations_user_idx on estacion33.reservations (user_id, created_at desc);

create trigger reservations_set_updated_at
  before update on estacion33.reservations
  for each row execute function estacion33.set_updated_at();

-- ---------------------------------------------------------------------------
-- 8. loyalty_points
-- ---------------------------------------------------------------------------
create table estacion33.loyalty_points (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  points int not null,
  source text not null,
  order_id uuid references estacion33.orders(id) on delete set null,
  created_at timestamptz not null default now()
);

create index loyalty_points_user_idx on estacion33.loyalty_points (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 9. RLS — enable on every table, then policies
-- ---------------------------------------------------------------------------
alter table estacion33.profiles         enable row level security;
alter table estacion33.categories       enable row level security;
alter table estacion33.products         enable row level security;
alter table estacion33.product_options  enable row level security;
alter table estacion33.option_values    enable row level security;
alter table estacion33.addresses        enable row level security;
alter table estacion33.service_windows  enable row level security;
alter table estacion33.orders           enable row level security;
alter table estacion33.order_items      enable row level security;
alter table estacion33.reservations     enable row level security;
alter table estacion33.loyalty_points   enable row level security;

-- Public read: menu + service hours are world-readable (anon + authenticated).
create policy "categories_public_read"      on estacion33.categories      for select using (true);
create policy "products_public_read"        on estacion33.products        for select using (true);
create policy "product_options_public_read" on estacion33.product_options for select using (true);
create policy "option_values_public_read"   on estacion33.option_values   for select using (true);
create policy "service_windows_public_read" on estacion33.service_windows for select using (true);

-- profiles: a user reads/updates only their own row.
create policy "profiles_self_select" on estacion33.profiles
  for select using (auth.uid() = id);
create policy "profiles_self_insert" on estacion33.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_self_update" on estacion33.profiles
  for update using (auth.uid() = id);

-- addresses: a user manages only their own addresses.
create policy "addresses_self_all" on estacion33.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- orders: signed-in users see their own orders; guests can insert (user_id null).
-- Updates (status changes etc.) are admin-only via service_role; no client-side update policy.
create policy "orders_self_select" on estacion33.orders
  for select using (auth.uid() = user_id);
create policy "orders_anyone_insert" on estacion33.orders
  for insert with check (user_id is null or auth.uid() = user_id);

-- order_items: select if you can see the parent order.
create policy "order_items_via_order_select" on estacion33.order_items
  for select using (
    exists (
      select 1 from estacion33.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );
create policy "order_items_anyone_insert" on estacion33.order_items
  for insert with check (
    exists (
      select 1 from estacion33.orders o
      where o.id = order_items.order_id
        and (o.user_id is null or o.user_id = auth.uid())
    )
  );

-- reservations: signed-in users see their own; guests can insert (user_id null).
create policy "reservations_self_select" on estacion33.reservations
  for select using (auth.uid() = user_id);
create policy "reservations_anyone_insert" on estacion33.reservations
  for insert with check (user_id is null or auth.uid() = user_id);

-- loyalty_points: users see their own; mutations are server-side only.
create policy "loyalty_self_select" on estacion33.loyalty_points
  for select using (auth.uid() = user_id);

-- service_role bypasses RLS automatically — admin and edge functions
-- (orders status updates, MercadoPago webhook, loyalty awards) use that key.
