import { formatMxn } from '@estacion33/core';
import { getServerSupabase } from '@/lib/supabase/server';
import { OrdersAdminTable } from './OrdersAdminTable';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const supabase = await getServerSupabase();

  const { data: orders } = await supabase
    .from('orders')
    .select(
      'id, status, fulfillment, scheduled_for, total_cents, payment_status, notes, created_at',
    )
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <h1 style={{ margin: 0, color: 'var(--color-brand-primaryDark)' }}>Pedidos</h1>
        <p style={{ color: 'var(--color-neutral-500)', fontSize: 14, margin: 0 }}>
          Cambia el estado conforme avanza el pedido. Los cambios se guardan al instante.
        </p>
      </header>

      <OrdersAdminTable
        rows={(orders ?? []).map((o) => ({
          id: o.id,
          status: o.status,
          fulfillment: o.fulfillment,
          scheduled_for: o.scheduled_for,
          total: formatMxn(o.total_cents),
          payment_status: o.payment_status,
          notes: o.notes,
          created_at: o.created_at,
        }))}
      />
    </div>
  );
}
