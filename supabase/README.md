# Supabase

Local-first Supabase setup for Estación 33.

## Layout

- `migrations/` — SQL schema migrations (timestamp-prefixed)
- `functions/` — Deno edge functions (MercadoPago, email, etc.)
- `seed.sql` — initial data (categories, products, options) — generated from `docs/menu-seed.md`

## Schema strategy

All Estación 33 tables live in the **`estacion33` Postgres schema**, not in `public`.

```sql
create schema if not exists estacion33;
create table estacion33.products (...);
```

This lets us share the existing `aldowecitellc` Supabase project with other Aldo Website LLC products (whose tables sit in `public`) without collisions. Supabase client auto-routes via:

```ts
const supabase = createClient(url, key, { db: { schema: 'estacion33' } });
```

### Migration to a dedicated project (later)

When Estación 33 graduates to its own Supabase project:

```sh
# from current shared project
pg_dump "$DATABASE_URL" \
  --schema=estacion33 \
  --no-owner --no-privileges \
  > estacion33-export.sql

# rewrite schema name in the dump
sed -i 's/estacion33\./public./g' estacion33-export.sql

# restore into new project
psql "$NEW_PROJECT_DATABASE_URL" < estacion33-export.sql
```

Then drop the schema config from the client. Single 30-minute job.

## Local workflow (no Docker)

```sh
pnpm supabase login
pnpm supabase link --project-ref <ref>
pnpm supabase migration new <name>
# edit the generated SQL file
pnpm supabase db push
```

## Local with Docker (Phase 3+)

```sh
brew install supabase/tap/supabase   # or scoop install supabase
supabase start
supabase db reset                     # apply migrations + seed
supabase functions serve              # local edge function runtime
```

Migrations and edge functions land in **Phase 3**. Practice migrations from Phase 2
(`*_hello_world.sql`, `*_drop_hello_world.sql`) are kept in `migrations/` as workflow
reference.
