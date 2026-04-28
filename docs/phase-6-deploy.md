# Phase 6 — Deploy `apps/web` to `https://www.estacion33.com`

Live plan. Update statuses as you go.

## Sequence

- [ ] **1. Vercel project**
  - Sign in at <https://vercel.com> with **GitHub** (use the same account that owns
    `Aldonvacriates/estacion33`).
  - **Add New → Project** → pick `Aldonvacriates/estacion33`.
  - **Framework preset:** Next.js (auto-detected).
  - **Root directory:** leave at repo root `./` — `vercel.json` (in this PR)
    handles the monorepo build (`pnpm --filter estacion33-web build`).
  - Click **Deploy**. First deploy will take ~3 min.

- [ ] **2. Environment variables (Vercel → Settings → Environment Variables)**
  Add these for **all three environments** (Production, Preview, Development):

  | Name | Value | Notes |
  |---|---|---|
  | `NEXT_PUBLIC_SUPABASE_URL` | `https://odzqcbbnkwkwkdajtswf.supabase.co` | Public |
  | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…` | Public, from Supabase Connect panel |
  | `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | `APP_USR-…` | Public, MP test credentials for now |

  > Production-only later: replace the MP key with **production** credentials
  > the day you flip the switch (Phase 6.x once business is verified).

- [ ] **3. First successful deploy → preview URL**
  After step 2, **Redeploy** from the Deployments tab. You'll get a URL like
  `https://estacion33-xxxx.vercel.app`. Open it, smoke-test:
  - `/menu` renders with images
  - Add to cart → checkout (cash) → order page works
  - `/cuenta` magic-link sign-in works (note: emails come from Supabase
    on free tier — check spam)

- [ ] **4. Custom domain `www.estacion33.com`**
  - Vercel → Project → **Settings → Domains** → **Add** `www.estacion33.com`
    AND `estacion33.com` (Vercel handles redirect from apex to www).
  - Vercel shows DNS records to set. Two paths:
    - **A) Use Vercel as nameserver** (easiest if domain is fresh): point
      registrar's nameservers to `ns1.vercel-dns.com` + `ns2.vercel-dns.com`.
    - **B) Keep current nameservers**: add the records Vercel shows
      (`A 76.76.21.21` for apex, `CNAME cname.vercel-dns.com` for www).
  - Wait 5–60 min for DNS propagation. Vercel auto-issues an SSL cert.

- [ ] **5. Production env URLs in Supabase**
  Update Supabase secret so MercadoPago redirects back to the real domain
  with `auto_return: 'approved'` enabled (only set this *after* DNS resolves):

  ```sh
  pnpm supabase secrets set PUBLIC_WEB_URL=https://www.estacion33.com
  ```

  No code change needed — the edge function already reads this var and
  enables `auto_return` on non-localhost URLs.

- [ ] **6. MercadoPago webhook URL**
  Already correct: the function lives at
  `https://odzqcbbnkwkwkdajtswf.supabase.co/functions/v1/mercadopago-webhook`,
  which doesn't change. Just confirm the MP dashboard still has it set
  (Tu integración → Webhooks).

- [ ] **7. Production smoke test**
  - Open `https://www.estacion33.com/menu` from your phone
  - Place a cash order → verify in `/admin/ordenes`
  - Place a MercadoPago order with test card `5031 7557 3453 0604`,
    name `APRO`, any future expiry, CVV `123`. After paying, MP should
    redirect to `https://www.estacion33.com/orden/<id>?status=success`
  - Send your dad the URL + admin promote SQL

## Optional polish (do later, not blocking launch)

- **Custom auth emails (SMTP)** — Supabase Pro lets you wire Resend or SES
  so magic-link emails come from `noreply@estacion33.com` instead of
  `mail.supabase.co`. Settings → Authentication → SMTP.
- **Sentry** for runtime errors on web.
- **PostHog** for `view_menu` / `add_to_cart` / `purchase` analytics.
- **Vercel Analytics** (free tier) for Web Vitals.
- **Production MercadoPago credentials** — swap `TEST-…` for real ones
  when business KYC clears.

## Rollback

If a deploy breaks production:
- Vercel → Deployments → find the last good deploy → **Promote to Production**.
- Or `git revert <bad commit>` and push; Vercel auto-redeploys.
