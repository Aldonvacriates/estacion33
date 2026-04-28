import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';
import {
  buildWaLink,
  customerToRestaurantReservationMessage,
  restaurantWhatsApp,
} from '@/lib/whatsapp';

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
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(36px, 6vw, 52px)',
            fontWeight: 400,
            color: 'var(--color-brand-ink)',
            lineHeight: 1,
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

      <WhatsAppConfirmReservationButton
        reservation={{
          id: reservation.id,
          guest_name: reservation.guest_name,
          party_size: reservation.party_size,
          slot_at: reservation.slot_at,
        }}
      />

      <Link href="/menu" style={{ alignSelf: 'center' }}>
        <span
          style={{
            color: 'var(--color-brand-primaryDark)',
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

function WhatsAppConfirmReservationButton({
  reservation,
}: {
  reservation: {
    id: string;
    guest_name: string;
    party_size: number;
    slot_at: string;
  };
}) {
  const number = restaurantWhatsApp();
  if (!number) return null;
  const href = buildWaLink(
    number,
    customerToRestaurantReservationMessage(reservation),
  );
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        alignSelf: 'center',
        background: 'var(--color-brand-whatsapp)',
        color: '#FFFFFF',
        padding: '12px 24px',
        borderRadius: '999px',
        fontWeight: 700,
        fontSize: 15,
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span aria-hidden style={{ fontSize: 18, lineHeight: 1 }}>💬</span>
      Confirmar por WhatsApp
    </a>
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
