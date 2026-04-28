-- Phase 2 of /repartidor: photo proof of delivery.
-- Adds the column on orders + a private storage bucket with RLS.
-- Customer + admin + the delivery driver can read; only the assigned
-- driver can insert.

alter table estacion33.orders
  add column delivery_proof_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'delivery-proofs',
  'delivery-proofs',
  false,                               -- private; access via signed URL only
  10 * 1024 * 1024,                    -- 10 MB per photo (phone cameras can be chunky)
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do nothing;

-- Repartidor can upload / overwrite / delete proofs for orders assigned to them.
create policy "delivery_proofs_repartidor_write"
  on storage.objects
  for all
  to authenticated
  using (
    bucket_id = 'delivery-proofs'
    and estacion33.is_repartidor()
    and exists (
      select 1 from estacion33.orders o
      where o.delivery_proof_path = storage.objects.name
        and o.delivery_driver_id = auth.uid()
    )
  )
  with check (
    bucket_id = 'delivery-proofs' and estacion33.is_repartidor()
  );

-- Admin can read + manage anything in the bucket.
create policy "delivery_proofs_admin_all"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'delivery-proofs' and estacion33.is_admin())
  with check (bucket_id = 'delivery-proofs' and estacion33.is_admin());

-- Customer can read the proof photo for their own delivered order.
create policy "delivery_proofs_customer_select"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'delivery-proofs'
    and exists (
      select 1 from estacion33.orders o
      where o.delivery_proof_path = storage.objects.name
        and o.user_id = auth.uid()
    )
  );
