-- Practice migration. Throwaway table — namespaced with _practice_ so it
-- can't be confused with anything in the existing schema. Dropped in the
-- next migration.

create table public._practice_hello (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  created_at timestamptz not null default now()
);

create index _practice_hello_created_at_idx
  on public._practice_hello (created_at desc);

insert into public._practice_hello (message) values
  ('hola desde estación 33'),
  ('migration workflow funciona');
