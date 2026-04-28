'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Database } from '@estacion33/core';
import { getBrowserSupabase } from '@/lib/supabase/client';
import { useCart } from '@/lib/cart';
import { StatusTimeline } from './StatusTimeline';

type OrderRow = {
  id: string;
  status: Database['estacion33']['Enums']['order_status'];
  fulfillment: Database['estacion33']['Enums']['fulfillment_type'];
  payment_status: Database['estacion33']['Enums']['payment_status'];
};

/**
 * Subscribes to changes on a single order via Supabase Realtime and
 * re-renders the timeline when status/payment_status flips. Also handles
 * cart auto-clear when MercadoPago redirects back with status=success.
 */
export function OrderLive({
  orderId,
  initial,
  paymentStatusFromUrl,
}: {
  orderId: string;
  initial: OrderRow;
  paymentStatusFromUrl: string | undefined;
}) {
  const [order, setOrder] = useState<OrderRow>(initial);
  const router = useRouter();
  const clearCart = useCart((s) => s.clear);

  // Clear the cart when MP redirected back with a success status.
  useEffect(() => {
    if (paymentStatusFromUrl === 'success') {
      clearCart();
    }
  }, [paymentStatusFromUrl, clearCart]);

  useEffect(() => {
    const supabase = getBrowserSupabase();
    const channel = supabase
      .channel(`order:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'estacion33',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const next = payload.new as Partial<OrderRow>;
          setOrder((prev) => ({ ...prev, ...next }));
          // Refresh server-rendered parts (notes, totals, etc) too.
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, router]);

  return <StatusTimeline status={order.status} fulfillment={order.fulfillment} />;
}
