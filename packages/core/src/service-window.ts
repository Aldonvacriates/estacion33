export type ServiceWindow = {
  /** ISO weekday: 1=Mon, 7=Sun. Estación 33 opens Thu(4), Fri(5), Sat(6). */
  dow: number;
  /** "HH:mm" 24h, restaurant local time */
  opens: string;
  /** "HH:mm" 24h, restaurant local time */
  closes: string;
};

export const ESTACION33_WINDOWS: readonly ServiceWindow[] = [
  { dow: 4, opens: '18:30', closes: '22:30' },
  { dow: 5, opens: '18:30', closes: '22:30' },
  { dow: 6, opens: '18:30', closes: '22:30' },
] as const;

export const RESTAURANT_TZ = 'America/Mexico_City';
export const LAST_CALL_MINUTES = 30;
export const PRE_OPEN_MINUTES = 60;

export type ServiceStatus = 'closed' | 'pre_open' | 'open' | 'last_call';

export type ServiceWindowState = {
  status: ServiceStatus;
  nextOpenAt: Date | null;
  closesAt: Date | null;
  lastSlotAt: Date | null;
};

const isoDow = (d: Date): number => {
  const js = d.getDay();
  return js === 0 ? 7 : js;
};

const setHm = (base: Date, hm: string): Date => {
  const [h = 0, m = 0] = hm.split(':').map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
};

/**
 * Returns the current service-window state. Drives banners, time-slot pickers,
 * and disabled-CTA states across web + mobile.
 *
 * NOTE: Computes against the system local timezone. For production accuracy
 * with users outside CDMX, swap to a tz-aware library and pass RESTAURANT_TZ.
 */
export function getServiceWindow(
  now: Date = new Date(),
  windows: readonly ServiceWindow[] = ESTACION33_WINDOWS,
): ServiceWindowState {
  const today = isoDow(now);
  const todayWindow = windows.find((w) => w.dow === today);

  if (todayWindow) {
    const opensAt = setHm(now, todayWindow.opens);
    const closesAt = setHm(now, todayWindow.closes);
    const preOpenAt = new Date(opensAt.getTime() - PRE_OPEN_MINUTES * 60_000);
    const lastCallAt = new Date(closesAt.getTime() - LAST_CALL_MINUTES * 60_000);

    if (now >= opensAt && now < lastCallAt) {
      return {
        status: 'open',
        nextOpenAt: null,
        closesAt,
        lastSlotAt: lastCallAt,
      };
    }
    if (now >= lastCallAt && now < closesAt) {
      return {
        status: 'last_call',
        nextOpenAt: null,
        closesAt,
        lastSlotAt: closesAt,
      };
    }
    if (now >= preOpenAt && now < opensAt) {
      return {
        status: 'pre_open',
        nextOpenAt: opensAt,
        closesAt,
        lastSlotAt: null,
      };
    }
  }

  const nextOpen = nextOpenAfter(now, windows);
  return {
    status: 'closed',
    nextOpenAt: nextOpen,
    closesAt: null,
    lastSlotAt: null,
  };
}

function nextOpenAfter(now: Date, windows: readonly ServiceWindow[]): Date | null {
  if (windows.length === 0) return null;
  for (let offset = 0; offset < 14; offset++) {
    const candidate = new Date(now);
    candidate.setDate(candidate.getDate() + offset);
    const dow = isoDow(candidate);
    const w = windows.find((x) => x.dow === dow);
    if (!w) continue;
    const opensAt = setHm(candidate, w.opens);
    if (opensAt > now) return opensAt;
  }
  return null;
}
