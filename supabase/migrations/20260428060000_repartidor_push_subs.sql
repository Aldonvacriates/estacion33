-- Phase 5b groundwork for /repartidor phase 6 (push notifications).
-- Stores Web Push subscriptions per repartidor per device. Empty for now;
-- phase 6 will add the action that calls pushManager.subscribe() on the
-- driver page and inserts a row here, plus an edge function that reads
-- this table to push offers.
--
-- Schema follows the standard Web Push browser API shape:
--   endpoint: unique URL the push service hands the browser
--   p256dh / auth: public crypto keys for end-to-end-ish encryption

create table if not exists estacion33.repartidor_push_subs (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references estacion33.profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

create index if not exists repartidor_push_subs_driver_idx
  on estacion33.repartidor_push_subs (driver_id);

alter table estacion33.repartidor_push_subs enable row level security;

-- Driver can manage their own subscriptions (insert / select / delete).
create policy "push_subs_self_all"
  on estacion33.repartidor_push_subs
  for all
  to authenticated
  using (driver_id = auth.uid())
  with check (driver_id = auth.uid() and estacion33.is_repartidor());

-- Admin can read every subscription (useful for debugging push delivery).
create policy "push_subs_admin_select"
  on estacion33.repartidor_push_subs
  for select
  to authenticated
  using (estacion33.is_admin());

grant insert, select, delete on estacion33.repartidor_push_subs to authenticated;
