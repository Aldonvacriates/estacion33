'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserSupabase } from '@/lib/supabase/client';

// Subscribes to the `orders` realtime channel for any change relevant to
// the queue. When something comes in, we call router.refresh() so the
// server-rendered queue page re-fetches with the latest list. Optionally
// plays a chime if the driver opted into audio alerts.
//
// Why this layer instead of a fully client-rendered queue: server-side RLS
// + Supabase joins are easier to reason about than re-querying from the
// browser. router.refresh() reuses the existing SSR query, just live.

const ALERT_KEY = 'estacion33.repartidor.audioAlert';

export function QueueLive() {
  const router = useRouter();
  const lastSeenRef = useRef<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const supabase = getBrowserSupabase();

    const channel = supabase
      .channel('repartidor-queue')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'estacion33',
          table: 'orders',
        },
        () => router.refresh(),
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'estacion33',
          table: 'orders',
        },
        (payload) => {
          const next = payload.new as {
            id: string;
            status: string;
            fulfillment: string;
            delivery_driver_id: string | null;
          };

          // Detect "freshly arrived in the queue": status=ready, delivery,
          // unclaimed, AND we hadn't seen it ready before. Plays a chime
          // if the driver enabled audio alerts.
          const becameReady =
            next.status === 'ready' &&
            next.fulfillment === 'delivery' &&
            !next.delivery_driver_id;
          if (becameReady && !lastSeenRef.current.has(next.id)) {
            lastSeenRef.current.add(next.id);
            const enabled =
              typeof window !== 'undefined' &&
              window.localStorage.getItem(ALERT_KEY) === '1';
            if (enabled && audioRef.current) {
              void audioRef.current.play().catch(() => {
                /* user hasn't interacted with the page yet — browser blocks. */
              });
            }
          }
          if (next.status !== 'ready') {
            lastSeenRef.current.delete(next.id);
          }
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [router]);

  // Inline data URI for a short pleasant ding so we don't have to ship an
  // mp3 asset. ~120ms, low volume.
  return (
    <audio
      ref={audioRef}
      preload="auto"
      // 440Hz sine wave 200ms @ 0.4 amplitude — generated once.
      src="data:audio/wav;base64,UklGRiQEAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAEAAB7/14HRgF8DXcDLwjGCQUH6gqBC1QH9wpaCoQGqAgyByEFJgY3BO0EuwTOA0gG/wT4BvIIIAh3CqMK0AmRCq4HpgjVBO8FTwLwAjkA6P+J/r78f/y4+vT6Mvka+t/4G/p1+fL5xfle+m760foL+wj7kPum+/L7BPwZ/Pn7Avxp+0r7VPpY+lH5IPnT+Hr4Y/jl9zr4kfdc+M73XPjN9+P3aPe39yz30Pfc91X5tvld+5b8YP46/wMByQEEA4oDgQTYBKsFugWvBkkGmQfABhMINQfWB9YGdAaCBYAFlwT/BPYDQAQ7A+ICKAItAUkB9P9OAJv+Of4S/Vj8jPup+iL66vif+Hb3OPdN9p72RPYR9z73XfgX+ar60vte/bD+VABTAcMC2wPVBE4FFAamBesG1wbpBxsH9QdBB6kGEQYTBeoEdgQwBC8E0gMoBLkD2gPyAkICCQGQAFn/i/4y/QH8r/oH+R74dvYE9rb0VPRk88nzKfPB8w7zr/MM86nzwPP186z0M/aL9o/4kvm8++D8cv4N/9z/U/8//1f++/2//Cj9j/s7/IL71vvO+qb6Ufm0+bf4mPjU99r3oPft9rL3kfcS+Iv4dvkR+sH7uvyc/lT/EwG1ASoDtgPABMAEEgWLBJUE6QPiAyEDDgNdAjkCnAFTAW4AVQAdAB7+5/16/M37vvk7+fz3CPfa9bz1d/SC9C30TvSP9Hb0J/V99R32JfYS+OL3xfk3+iH88PwM/iL/T/+T//7/y//7/2T/uf/v/lf+pP3z/JT8KPyz/Ar9JP3F/X3+Yv5G/+P+dv/H/lH+H/2u/J/79foH+m752/iY9wD3WPV29F70p/Iy8wjy0vJD8sLztPPx9Tn28PiI+Yv8Df42AbEC7AVMByYK9AvyDcUOIA9qDvANSwxvDFQKtwpiCDoIzgUWBKwBOf+8/aP8svxi+9j7c/qF+5L7M/3l/bz/RQGgAUEDmgPKAxAERgRpA0YDmgGgADb/v/yJ+1n5OvgT9wH2HPas9NL0afOG87/yzfHB8Q3xX/Hb8RHzZvPi9LL10Pf9+IT79vyl/iQAfAGSAlcCpAJ6AvECOQNXBNwELQYzBuMG3AVXBlwFAQUSBHYDqQK1AdcAxv8SAFP+UP4F/Sv8KPst+3v6jvor+v75pPmb+SX5Avgi9233sPbF96/41vlA+wD9JP63/9f/dwHCAW8DkAOoBHcEjAQ5BHEDmwOKAmgCbgEWAQEABf+6/Z/82fp9+ev3Wvbo9KrzJ/J28a/wHvDh76rvT/AB8aLyVPMQ9TX2Iflv+sf9rP7fAFEC2gNDBO0E5gRRBVcF3wRcBHYDpwK0AVMA"
    />
  );
}

export function setAudioAlertPref(enabled: boolean) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ALERT_KEY, enabled ? '1' : '0');
}

export function getAudioAlertPref(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(ALERT_KEY) === '1';
}
