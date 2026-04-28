-- Repartidor (delivery driver) role for Estación 33.
-- Phase 1 of the /repartidor feature: role flag, order-claim columns,
-- cash collection toggle, RLS policies. Phases 2 (proof photos) and 3
-- (live GPS) ship in their own migrations.

alter table estacion33.profiles
  add column is_repartidor boolean not null default false,
  add column always_on_gps boolean not null default false;

alter table estacion33.orders
  add column delivery_driver_id uuid references estacion33.profiles(id),
  add column delivery_started_at timestamptz,
  add column delivery_completed_at timestamptz,
  add column cash_collected boolean not null default false;

-- Helper: is_repartidor() mirroring is_admin().
create or replace function estacion33.is_repartidor()
returns boolean
language sql
stable
security definer
set search_path = estacion33, public
as $$
  select coalesce(
    (select is_repartidor from estacion33.profiles where id = auth.uid()),
    false
  );
$$;

grant execute on function estacion33.is_repartidor() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- RLS — repartidor on orders
-- Repartidores can SELECT orders that are ready for delivery (so they can
-- pick from the queue) AND any order assigned to them. They can UPDATE
-- only the delivery columns + the status transitions ready→out_for_delivery
-- and out_for_delivery→delivered + cash_collected. Server actions enforce
-- the column-level / status-transition limits; RLS gates row-level access.
-- ---------------------------------------------------------------------------

create policy "orders_repartidor_select_queue" on estacion33.orders
  for select
  using (
    estacion33.is_repartidor() and (
      (status = 'ready' and fulfillment = 'delivery' and delivery_driver_id is null)
      or delivery_driver_id = auth.uid()
    )
  );

create policy "orders_repartidor_update_assigned" on estacion33.orders
  for update
  using (
    estacion33.is_repartidor() and (
      (status = 'ready' and fulfillment = 'delivery' and delivery_driver_id is null)
      or delivery_driver_id = auth.uid()
    )
  )
  with check (estacion33.is_repartidor());

create policy "order_items_repartidor_select" on estacion33.order_items
  for select
  using (
    estacion33.is_repartidor() and exists (
      select 1 from estacion33.orders o
      where o.id = order_items.order_id
        and o.delivery_driver_id = auth.uid()
    )
  );

-- Indexes for the queue + my-deliveries lookups.
create index if not exists orders_repartidor_queue_idx
  on estacion33.orders (scheduled_for)
  where status = 'ready' and fulfillment = 'delivery' and delivery_driver_id is null;

create index if not exists orders_by_driver_idx
  on estacion33.orders (delivery_driver_id, status);
