-- Public bucket for product photos. Anyone can read (so customer-facing
-- /menu can render the images), only admins can write (RLS via the
-- estacion33.is_admin() helper).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'menu-images',
  'menu-images',
  true,
  5 * 1024 * 1024,  -- 5 MB per file
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Storage RLS: admins can insert/update/delete anything in this bucket.
create policy "menu_images_admin_write"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'menu-images' and estacion33.is_admin())
  with check (bucket_id = 'menu-images' and estacion33.is_admin());

-- Public read is automatic for buckets with `public = true`, no policy needed.
