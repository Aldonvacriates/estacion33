import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const RES_STATUS_LABEL: Record<string, string> = {
  pending: 'Por confirmar',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  no_show: 'No asistió',
};

export default async function ReservationConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await getServerSupabase();

  const { data: reservation, error } = await supabase
    .from('reservations')
    .select('id, guest_name, phone, party_size, slot_at, status, notes, created_at')
    .eq('id', id)
    .single();

  if (error || !reservation) notFound();

  return (
    <main
      style={{
        maxWidth: 'var(--size-containerSm)',
        margin: '0 auto',
        padding: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
      }}
    >
      <header
        style={{
          background: 'var(--color-brand-primary50)',
          padding: 'var(--space-5)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--color-brand-primaryDark)',
          }}
        >
          ¡Reserva recibida!
        </h1>
        <p style={{ margin: 0, color: 'var(--color-neutral-700)' }}>
          Te confirmaremos por WhatsApp al <strong>{reservation.phone}</strong>.
        </p>
      </header>

      <section
        style={{
          background: 'var(--color-neutral-50)',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
        }}
      >
        <Row label="Folio" value={<code>{reservation.id.slice(0, 8)}</code>} />
        <Row label="Estado" value={RES_STATUS_LABEL[reservation.status] ?? reservation.status} />
        <Row label="A nombre de" value={reservation.guest_name} />
        <Row
          label="Personas"
          value={`${reservation.party_size} ${reservation.party_size === 1 ? 'persona' : 'personas'}`}
        />
        <Row
          label="Fecha y hora"
          value={new Date(reservation.slot_at).toLocaleString('es-MX', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        />
        {reservation.notes ? <Row label="Notas" value={reservation.notes} /> : null}
      </section>

      <p style={{ color: 'var(--color-neutral-500)', fontSize: 14, textAlign: 'center', margin: 0 }}>
        Plan de Iguala s/n, Col. Burócrata
      </p>

      <Link href="/menu" style={{ alignSelf: 'center' }}>
        <span
          style={{
            color: 'var(--color-brand-primary)',
            fontWeight: 600,
            textDecoration: 'underline',
          }}
        >
          Mientras tanto, ver el menú →
        </span>
      </Link>
    </main>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
        fontSize: 14,
        alignItems: 'flex-start',
      }}
    >
      <span style={{ color: 'var(--color-neutral-700)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 600, color: 'var(--color-neutral-900)', textAlign: 'right' }}>
        {value}
      </span>
    </div>
  );
}
