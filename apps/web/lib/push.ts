import 'server-only';
import webpush from 'web-push';

// Single source of truth for the VAPID-configured web-push instance. We
// memoize the setVapidDetails() call so it doesn't run on every request.
//
// All three env vars are checked once at module load. If any is missing
// (which is fine in dev / preview where push is disabled), every helper
// in this file becomes a graceful no-op.

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const SUBJECT = process.env.VAPID_SUBJECT;

let configured = false;

function ensureConfigured(): boolean {
  if (configured) return true;
  if (!PUBLIC_KEY || !PRIVATE_KEY || !SUBJECT) return false;
  webpush.setVapidDetails(SUBJECT, PUBLIC_KEY, PRIVATE_KEY);
  configured = true;
  return true;
}

export type PushSub = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export type NotificationPayload = {
  title: string;
  body: string;
  /** Same-origin URL the notification opens when tapped. */
  url: string;
  /** Used to dedupe — newer notifications with the same tag replace the old one. */
  tag?: string;
};

export async function sendPushTo(
  sub: PushSub,
  payload: NotificationPayload,
): Promise<{ ok: true } | { ok: false; status?: number; error: string }> {
  if (!ensureConfigured()) {
    return { ok: false, error: 'vapid_not_configured' };
  }
  try {
    await webpush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      },
      JSON.stringify(payload),
      { TTL: 60 * 5 }, // expire offers after 5 min
    );
    return { ok: true };
  } catch (err: unknown) {
    // 404/410 = subscription is gone, caller should delete the row.
    const status =
      typeof err === 'object' && err && 'statusCode' in err
        ? Number((err as { statusCode: number }).statusCode)
        : undefined;
    const message =
      typeof err === 'object' && err && 'body' in err
        ? String((err as { body: string }).body)
        : String(err);
    return { ok: false, status, error: message };
  }
}
