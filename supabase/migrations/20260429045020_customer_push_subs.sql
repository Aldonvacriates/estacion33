-- Customer-side Web Push subscriptions. Mirrors repartidor_push_subs but
-- keyed by user_id (any authenticated profile, no role required) so we can
-- ping a customer when their order moves through statuses
-- (paid → preparing → ready → out_for_delivery → delivered).
--
-- Same browser-API shape: endpoint + p256dh + auth keys.

create table if not exists estacion33.customer_push_subs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references estacion33.profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

create index if not exists customer_push_subs_user_idx
  on estacion33.customer_push_subs (user_id);

alter table estacion33.customer_push_subs enable row level security;

-- Customer manages their own subscriptions across devices.
create policy "customer_push_subs_self_all"
  on estacion33.customer_push_subs
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Admin can read for debugging (no write — we don't want admins
-- accidentally subscribing on behalf of customers).
create policy "customer_push_subs_admin_select"
  on estacion33.customer_push_subs
  for select
  to authenticated
  using (estacion33.is_admin());

grant insert, select, delete on estacion33.customer_push_subs to authenticated;
