// Server-side Supabase client for Next.js App Router.
// Uses cookies for auth — works in server components, server actions, and route handlers.
// Always scoped to the `estacion33` Postgres schema.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@estacion33/core';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set in apps/web/.env.local',
  );
}

export async function getServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient<Database>(url!, publishableKey!, {
    db: { schema: 'estacion33' },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // setAll throws in server components — safe to ignore when only reading session.
        }
      },
    },
  });
}
