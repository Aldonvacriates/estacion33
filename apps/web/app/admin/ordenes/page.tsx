import { formatMxn } from '@estacion33/core';
import type { Database } from '@estacion33/core';
import { getServerSupabase } from '@/lib/supabase/server';
import { OrdersAdminTable } from './OrdersAdminTable';

export const dynamic = 'force-dynamic';

type OrderStatus = Database['estacion33']['Enums']['order_status'];

type OrderRow = {
  id: string;
  status: OrderStatus;
  fulfillment: string;
  scheduled_for: string;
  total_cents: number;
  payment_status: string;
  notes: string | null;
  created_at: string;
  delivery_driver_id: string | null;
};

type DriverRow = {
  id: string;
  full_name: string | null;
};

export default async function AdminOrdersPage() {
  const supabase = await getServerSupabase();

  const [{ data: orders }, { data: drivers }] = await Promise.all([
    supabase
      .from('orders')
      .select(
        'id, status, fulfillment, scheduled_for, total_cents, payment_status, notes, created_at, delivery_driver_id',
      )
      .order('created_at', { ascending: false })
      .limit(200)
      .returns<OrderRow[]>(),
    supabase
      .from('profiles')
      .select('id, full_name')
      .eq('is_repartidor', true)
      .order('full_name', { ascending: true })
      .returns<DriverRow[]>(),
  ]);

  // Map driver_id → display name for the "Asignado a" badge.
  const driverNameById = new Map<string, string>();
  for (const d of drivers ?? []) {
    driverNameById.set(d.id, d.full_name ?? d.id.slice(0, 6));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <h1 style={{ margin: 0, color: 'var(--color-brand-primaryDark)' }}>Pedidos</h1>
        <p style={{ color: 'var(--color-neutral-500)', fontSize: 14, margin: 0 }}>
          Cambia el estado conforme avanza el pedido. Asigna un repartidor para que
          el pedido le aparezca directo a esa persona, o déjalo sin asignar para que
          cualquier repartidor lo pueda tomar.
        </p>
      </header>

      <OrdersAdminTable
        drivers={(drivers ?? []).map((d) => ({
          id: d.id,
          name: d.full_name ?? d.id.slice(0, 6),
        }))}
        rows={(orders ?? []).map((o) => ({
          id: o.id,
          status: o.status,
          fulfillment: o.fulfillment,
          scheduled_for: o.scheduled_for,
          total: formatMxn(o.total_cents),
          payment_status: o.payment_status,
          notes: o.notes,
          created_at: o.created_at,
          delivery_driver_id: o.delivery_driver_id,
          delivery_driver_name: o.delivery_driver_id
            ? (driverNameById.get(o.delivery_driver_id) ?? null)
            : null,
        }))}
      />
    </div>
  );
}
