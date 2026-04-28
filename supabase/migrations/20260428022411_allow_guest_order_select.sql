-- Allow anyone to SELECT guest orders (user_id is null). The unguessable
-- UUID in the URL is the access token — same pattern UberEats / DoorDash
-- use for order tracking links.
--
-- Why this is needed: the previous policies allowed INSERT for anon but
-- only SELECT for the order's owner. Supabase's INSERT-then-RETURNING
-- runs SELECT through RLS too, so a guest insert errored on the RETURNING
-- step ("new row violates row-level security policy"). This unblocks both
-- the insert flow and the /orden/[id] tracking page for guests.
--
-- Authenticated users keep their existing self-only policy.

create policy "orders_guest_select" on estacion33.orders
  for select using (user_id is null);

create policy "order_items_guest_select" on estacion33.order_items
  for select using (
    exists (
      select 1 from estacion33.orders o
      where o.id = order_items.order_id and o.user_id is null
    )
  );

create policy "reservations_guest_select" on estacion33.reservations
  for select using (user_id is null);
