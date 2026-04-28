-- Admin "archive" feature for finished orders. Orthogonal to status — an
-- order can be both `delivered` AND archived. The customer-facing pages
-- (/cuenta/ordenes, /orden/[id]) ignore archived_at, so the customer
-- always sees their own history. Stats / reports also keep archived
-- orders in their counts. The archive flag only hides rows from the
-- default admin orders list.
--
-- The existing `orders_admin_update` policy from 20260428041543_admin_role.sql
-- already permits admins to update any column, including archived_at, so no
-- new RLS policy is needed.

alter table estacion33.orders
  add column if not exists archived_at timestamptz;

create index if not exists orders_archived_at_idx
  on estacion33.orders (archived_at)
  where archived_at is not null;
