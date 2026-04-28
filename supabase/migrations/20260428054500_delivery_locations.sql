-- Phase 3 of /repartidor: live GPS pings.
-- Append-only table; one row per geolocation reading the driver's browser
-- sends while an order is out_for_delivery. We never delete, but a future
-- cleanup job can prune rows older than 7 days.

create table if not exists estacion33.delivery_locations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references estacion33.orders(id) on delete cascade,
  driver_id uuid not null references estacion33.profiles(id),
  lat double precision not null,
  lng double precision not null,
  accuracy_m double precision,
  recorded_at timestamptz not null default now()
);

create index if not exists delivery_locations_order_recent_idx
  on estacion33.delivery_locations (order_id, recorded_at desc);

alter table estacion33.delivery_locations enable row level security;

-- Driver inserts their own pings for orders assigned to them.
create policy "delivery_locations_driver_insert"
  on estacion33.delivery_locations
  for insert
  to authenticated
  with check (
    estacion33.is_repartidor()
    and driver_id = auth.uid()
    and exists (
      select 1 from estacion33.orders o
      where o.id = order_id
        and o.delivery_driver_id = auth.uid()
        and o.status = 'out_for_delivery'
    )
  );

-- Driver reads their own pings.
create policy "delivery_locations_driver_select"
  on estacion33.delivery_locations
  for select
  to authenticated
  using (estacion33.is_repartidor() and driver_id = auth.uid());

-- Customer reads pings for their own order (the live map).
create policy "delivery_locations_customer_select"
  on estacion33.delivery_locations
  for select
  to authenticated
  using (
    exists (
      select 1 from estacion33.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

-- Admin reads everything.
create policy "delivery_locations_admin_select"
  on estacion33.delivery_locations
  for select
  to authenticated
  using (estacion33.is_admin());

grant insert, select on estacion33.delivery_locations to authenticated;

-- Add to realtime publication so the customer-side map can subscribe.
alter publication supabase_realtime add table estacion33.delivery_locations;
