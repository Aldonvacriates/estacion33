// Cloudflare Web Analytics beacon. Cookieless, no consent banner needed,
// no event cap. Only renders the <script> tag when NEXT_PUBLIC_CF_ANALYTICS_TOKEN
// is set, so local dev and any environment that hasn't been configured stay
// silent (no script load, no network request).
//
// To activate:
//   1. Go to https://dash.cloudflare.com/?to=/:account/web-analytics
//   2. Add a site for estacion33.com (works whether or not the domain is
//      proxied through Cloudflare DNS — pick "Manual Setup").
//   3. Copy the token from the snippet Cloudflare shows you (it's the value
//      of `data-cf-beacon='{"token":"..."}'`).
//   4. In Vercel → Project → Settings → Environment Variables, add:
//        NEXT_PUBLIC_CF_ANALYTICS_TOKEN = <that token>
//      Apply to Production (and Preview if you want preview metrics too).
//   5. Redeploy. New pageviews show up in the Cloudflare dashboard within
//      a few minutes.

const TOKEN = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;

export function CloudflareAnalytics() {
  if (!TOKEN) return null;
  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: TOKEN })}
    />
  );
}
