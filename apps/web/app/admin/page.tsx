import Link from 'next/link';
import { formatMxn } from '@estacion33/core';
import { getServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = await getServerSupabase();

  // Today's window (00:00 to next 00:00 in restaurant local).
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const [
    { count: openOrdersCount },
    { data: revenueRows },
    { count: reservationsToday },
    { count: productsAvailable },
  ] = await Promise.all([
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .in('status', ['pending', 'paid', 'preparing', 'ready', 'out_for_delivery']),
    supabase
      .from('orders')
      .select('total_cents')
      .eq('payment_status', 'paid')
      .gte('created_at', startOfToday.toISOString())
      .lt('created_at', endOfToday.toISOString()),
    supabase
      .from('reservations')
      .select('id', { count: 'exact', head: true })
      .gte('slot_at', startOfToday.toISOString())
      .lt('slot_at', endOfToday.toISOString()),
    supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('available', true),
  ]);

  const todayRevenueCents = (revenueRows ?? []).reduce(
    (s, r) => s + (r.total_cents ?? 0),
    0,
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <h1 style={{ margin: 0, color: 'var(--color-brand-primaryDark)' }}>Resumen del día</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        <Tile
          label="Pedidos abiertos"
          value={openOrdersCount ?? 0}
          href="/admin/ordenes"
          accent
        />
        <Tile
          label="Ingreso de hoy"
          value={formatMxn(todayRevenueCents)}
          href="/admin/ordenes"
        />
        <Tile
          label="Reservas hoy"
          value={reservationsToday ?? 0}
          href="/admin/reservas"
        />
        <Tile
          label="Productos disponibles"
          value={productsAvailable ?? 0}
          href="/admin/menu"
        />
      </div>

      <p style={{ color: 'var(--color-neutral-500)', fontSize: 13, margin: 0 }}>
        Las cifras se calculan al cargar la página. Usa Pedidos para acciones en vivo.
      </p>
    </div>
  );
}

function Tile({
  label,
  value,
  href,
  accent = false,
}: {
  label: string;
  value: number | string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        background: accent ? 'var(--color-brand-primary)' : 'var(--color-neutral-0)',
        color: accent ? 'var(--color-neutral-0)' : 'inherit',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-lg)',
        border: accent ? 'none' : '1px solid var(--color-neutral-200)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        textDecoration: 'none',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.9 }}>
        {label}
      </span>
      <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{value}</span>
    </Link>
  );
}
