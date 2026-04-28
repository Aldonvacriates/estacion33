-- The initial schema migration only granted SELECT to `anon`. For guest
-- checkout (orders) and guest reservations we also need INSERT. RLS still
-- enforces user_id is null OR matches auth.uid(), so this doesn't open up
-- arbitrary writes — it just stops the GRANT layer from refusing the request
-- before RLS even runs.

grant insert on estacion33.orders        to anon;
grant insert on estacion33.order_items   to anon;
grant insert on estacion33.reservations  to anon;
