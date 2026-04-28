-- admin_list_users(): returns one row per profile joined with auth.users.email,
-- gated to admin callers only. Used by the /admin/usuarios page so an admin
-- can see every user with their email/phone/role flags in a single query
-- without needing the service-role key on the server.
--
-- Implementation note: security definer + a hard `is_admin()` check is the
-- pattern. Non-admin callers get zero rows (the view returns nothing rather
-- than throwing — keeps the type signature predictable).

create or replace function estacion33.admin_list_users()
returns table (
  id uuid,
  email text,
  full_name text,
  phone text,
  is_admin boolean,
  is_repartidor boolean,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = estacion33, public, auth
as $$
  select
    p.id,
    u.email::text as email,
    p.full_name,
    p.phone,
    p.is_admin,
    p.is_repartidor,
    p.created_at
  from estacion33.profiles p
  left join auth.users u on u.id = p.id
  where estacion33.is_admin()
  order by p.created_at desc;
$$;

grant execute on function estacion33.admin_list_users() to authenticated;
