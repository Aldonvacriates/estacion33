// Server-side Supabase client using the secret service-role key.
// Only available inside edge functions; never expose this to a browser.

import {
  createClient,
  type SupabaseClient,
} from 'npm:@supabase/supabase-js@2.45.4';

let cached: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient {
  if (cached) return cached;

  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceKey) {
    throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing');
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false },
    db: { schema: 'estacion33' },
  });
  return cached;
}
