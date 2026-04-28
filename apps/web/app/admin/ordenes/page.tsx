import Link from 'next/link';
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
  archived_at: string | null;
};

type DriverRow = {
  id: string;
  full_name: string | null;
};

type SearchParams = { archived?: string };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await getServerSupabase();
  const { archived } = await searchParams;
  const showArchived = archived === '1';

  const ordersQuery = supabase
    .from('orders')
    .select(
      'id, status, fulfillment, scheduled_for, total_cents, payment_status, notes, created_at, delivery_driver_id, archived_at',
    )
    .order('created_at', { ascending: false })
    .limit(200);

  const [{ data: orders }, { data: drivers }] = await Promise.all([
    showArchived
      ? ordersQuery.not('archived_at', 'is', null).returns<OrderRow[]>()
      : ordersQuery.is('archived_at', null).returns<OrderRow[]>(),
    supabase
      .from('profiles')
      .select('id, full_name')
      .eq('is_repartidor', true)
      .order('full_name', { ascending: true })
      .returns<DriverRow[]>(),
  ]);

  const driverNameById = new Map<string, string>();
  for (const d of drivers ?? []) {
    driverNameById.set(d.id, d.full_name ?? d.id.slice(0, 6));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <h1 style={{ margin: 0, color: 'var(--color-brand-primaryDark)' }}>
          Pedidos {showArchived ? '· Archivados' : ''}
        </h1>
        <p style={{ color: 'var(--color-neutral-500)', fontSize: 14, margin: 0 }}>
          {showArchived
            ? 'Pedidos archivados — siguen contando en estadísticas y el cliente todavía los ve en su historial.'
            : 'Cambia el estado conforme avanza el pedido. Asigna un repartidor para que el pedido le aparezca directo a esa persona, o déjalo sin asignar para que cualquier repartidor lo pueda tomar.'}
        </p>
        <nav style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          <Link
            href="/admin/ordenes"
            style={tabStyle(!showArchived)}
          >
            Activos
          </Link>
          <Link
            href="/admin/ordenes?archived=1"
            style={tabStyle(showArchived)}
          >
            Archivados
          </Link>
        </nav>
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
          archived: o.archived_at != null,
        }))}
      />
    </div>
  );
}

function tabStyle(active: boolean): React.CSSProperties {
  return {
    padding: '6px 14px',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    textDecoration: 'none',
    background: active ? 'var(--color-brand-primary)' : 'var(--color-neutral-100)',
    color: active ? 'var(--color-brand-ink)' : 'var(--color-neutral-700)',
    border: '1px solid transparent',
  };
}
