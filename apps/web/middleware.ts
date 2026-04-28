// Refreshes the Supabase auth session on every request so server
// components always see a fresh user. Required by @supabase/ssr.
//
// Pattern lifted from the official Supabase + Next.js App Router guide:
// https://supabase.com/docs/guides/auth/server-side/nextjs

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@estacion33/core';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response; // misconfig — let app surface its own error

  const supabase = createServerClient<Database>(url, key, {
    db: { schema: 'estacion33' },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // IMPORTANT: getUser() refreshes the session if needed and writes new cookies.
  // Don't remove this even though we don't use the user variable.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Run on every route except static files and Next internals.
    '/((?!_next/static|_next/image|favicon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
