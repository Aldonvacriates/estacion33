// Browser-side Supabase client for client components.
// Always scoped to the `estacion33` Postgres schema.

'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@estacion33/core';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set in apps/web/.env.local',
  );
}

let cached: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getBrowserSupabase() {
  if (cached) return cached;
  cached = createBrowserClient<Database>(url!, publishableKey!, {
    db: { schema: 'estacion33' },
  });
  return cached;
}
