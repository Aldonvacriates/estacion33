// Shared CORS headers for browser-callable edge functions.
//
// Tightening note: in production, replace '*' with the exact web origin
// (e.g. 'https://estacion33.mx'). For mobile / native callers there's no
// CORS check, so '*' is only relevant to the web app.

export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
