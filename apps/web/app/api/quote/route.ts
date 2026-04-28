import { NextResponse } from 'next/server';
import { QUOTES, quoteOfTheDay, randomQuote } from '@/lib/quotes';

// Public quote API.
//
//   GET /api/quote            → today's quote (deterministic, same all UTC day)
//   GET /api/quote?random=1   → uniformly random quote
//   GET /api/quote?all=1      → full list (for tooling / your portfolio apps)
//
// CORS is open so other apps (your portfolio sites, etc.) can fetch this
// from the browser without a proxy.
//
// Implementation note: data lives in lib/quotes.ts today. If we later move
// to a Supabase `quotes` table this handler is the only file that has to
// change — the response shape stays { quote: { text, author? } } | { quotes }.

export const runtime = 'edge';
export const revalidate = 60; // CDN caches each response for 60s

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const all = url.searchParams.get('all');
  const random = url.searchParams.get('random');

  if (all) {
    return NextResponse.json(
      { quotes: QUOTES, count: QUOTES.length },
      { headers: CORS_HEADERS },
    );
  }

  const quote = random ? randomQuote() : quoteOfTheDay();
  return NextResponse.json(
    { quote, count: QUOTES.length },
    { headers: CORS_HEADERS },
  );
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
