-- Admin role for Estación 33 staff (owner + manager + kitchen).
-- Stored as a boolean on profiles instead of a separate table — keeps
-- the policy expressions simple. Promote a user via:
--   update estacion33.profiles set is_admin = true where id = '<auth uuid>';

alter table estacion33.profiles
  add column is_admin boolean not null default false;

-- Helper: returns true if the current auth.uid() has is_admin=true.
-- Wrapped in a security-definer function so RLS policies on profiles
-- don't recursively block the lookup. STABLE so PG can cache per query.
create or replace function estacion33.is_admin()
returns boolean
language sql
stable
security definer
set search_path = estacion33, public
as $$
  select coalesce(
    (select is_admin from estacion33.profiles where id = auth.uid()),
    false
  );
$$;

grant execute on function estacion33.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Admin RLS — orders
-- Admins can SELECT/UPDATE every order.
-- ---------------------------------------------------------------------------
create policy "orders_admin_all_select" on estacion33.orders
  for select using (estacion33.is_admin());

create policy "orders_admin_update" on estacion33.orders
  for update using (estacion33.is_admin())
  with check (estacion33.is_admin());

-- ---------------------------------------------------------------------------
-- Admin RLS — order_items (read-only for admin via parent)
-- ---------------------------------------------------------------------------
create policy "order_items_admin_select" on estacion33.order_items
  for select using (estacion33.is_admin());

-- ---------------------------------------------------------------------------
-- Admin RLS — reservations
-- ---------------------------------------------------------------------------
create policy "reservations_admin_all_select" on estacion33.reservations
  for select using (estacion33.is_admin());

create policy "reservations_admin_update" on estacion33.reservations
  for update using (estacion33.is_admin())
  with check (estacion33.is_admin());

-- ---------------------------------------------------------------------------
-- Admin RLS — products + product_options + option_values
-- (existing policy already allows SELECT for everyone; this adds writes
-- for admins.)
-- ---------------------------------------------------------------------------
create policy "products_admin_write" on estacion33.products
  for all using (estacion33.is_admin())
  with check (estacion33.is_admin());

create policy "product_options_admin_write" on estacion33.product_options
  for all using (estacion33.is_admin())
  with check (estacion33.is_admin());

create policy "option_values_admin_write" on estacion33.option_values
  for all using (estacion33.is_admin())
  with check (estacion33.is_admin());

create policy "categories_admin_write" on estacion33.categories
  for all using (estacion33.is_admin())
  with check (estacion33.is_admin());

-- ---------------------------------------------------------------------------
-- Admin RLS — profiles (admins can see all, useful for assigning roles)
-- ---------------------------------------------------------------------------
create policy "profiles_admin_select_all" on estacion33.profiles
  for select using (estacion33.is_admin());

-- ---------------------------------------------------------------------------
-- Allow authenticated UPDATE on these tables so RLS policies can permit it.
-- (anon/authenticated GRANTs were already set in the original schema; UPDATE
-- specifically wasn't enabled for anon. authenticated already has it via
-- the default privileges. Confirming explicitly here.)
-- ---------------------------------------------------------------------------
grant update on
  estacion33.orders,
  estacion33.reservations,
  estacion33.products,
  estacion33.product_options,
  estacion33.option_values,
  estacion33.categories
to authenticated;

grant insert, delete on
  estacion33.products,
  estacion33.product_options,
  estacion33.option_values,
  estacion33.categories
to authenticated;
