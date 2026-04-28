'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@estacion33/ui/web';
import { getUpcomingSlots } from '@estacion33/core';
import { createReservationAction } from './actions';

const slotFormatter = new Intl.DateTimeFormat('es-MX', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export default function ReservarPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [slotAt, setSlotAt] = useState('');
  const [notes, setNotes] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 60-min slots for table reservations (longer than the 30-min order slots).
  const slots = useMemo(
    () => getUpcomingSlots(new Date(), undefined, { stepMinutes: 60, maxSlots: 18 }),
    [],
  );

  useEffect(() => {
    if (!slotAt && slots[0]) setSlotAt(slots[0].toISOString());
  }, [slotAt, slots]);

  const canSubmit =
    guestName.trim().length >= 2 &&
    phone.trim().length >= 8 &&
    partySize >= 1 &&
    partySize <= 20 &&
    slotAt.length > 0 &&
    !isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitError(null);

    startTransition(async () => {
      const result = await createReservationAction({
        guestName: guestName.trim(),
        phone: phone.trim(),
        partySize,
        slotAt,
        notes: notes.trim() || undefined,
      });
      if (!result.ok) {
        setSubmitError(result.error);
        return;
      }
      router.push(`/reservacion/${result.reservationId}`);
    });
  };

  return (
    <main
      style={{
        maxWidth: 'var(--size-containerSm)',
        margin: '0 auto',
        padding: 'var(--space-5)',
        paddingBottom: 96,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
      }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(28px, 5vw, 40px)',
            color: 'var(--color-brand-chili)',
            lineHeight: 1,
          }}
        >
          Reserva tu mesa
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(24px, 3vw, 32px)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-brand-ink)',
          }}
        >
          Para una noche especial
        </h1>
        <p style={{ margin: '8px 0 0', color: 'var(--color-neutral-700)', fontSize: 14 }}>
          Servicio jueves, viernes y sábado · 18:30 a 22:30. Confirmamos tu reserva por WhatsApp.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}
      >
        <Section title="Tus datos">
          <Field label="Nombre completo" required>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              style={inputStyle}
            />
          </Field>
          <Field label="Teléfono / WhatsApp" required>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              minLength={8}
              maxLength={20}
              autoComplete="tel"
              style={inputStyle}
            />
          </Field>
        </Section>

        <Section title="Reserva">
          <Field label="Personas" required>
            <PartyStepper value={partySize} onChange={setPartySize} />
          </Field>
          <Field label="Fecha y hora" required>
            {slots.length === 0 ? (
              <p style={{ color: 'var(--color-semantic-warningFg)', margin: 0 }}>
                No hay horarios disponibles en los próximos 14 días.
              </p>
            ) : (
              <select
                value={slotAt}
                onChange={(e) => setSlotAt(e.target.value)}
                required
                style={inputStyle}
              >
                {slots.map((slot) => {
                  const iso = slot.toISOString();
                  return (
                    <option key={iso} value={iso}>
                      {slotFormatter.format(slot)}
                    </option>
                  );
                })}
              </select>
            )}
          </Field>
        </Section>

        <Section title="Notas (opcional)">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Cumpleaños, alergias, etc."
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', height: 'auto', paddingBlock: 12 }}
          />
        </Section>

        {submitError ? (
          <div
            style={{
              background: 'var(--color-semantic-dangerBg)',
              color: 'var(--color-semantic-dangerFg)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              fontSize: 14,
            }}
          >
            Error: {submitError}
          </div>
        ) : null}

        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            padding: 'var(--space-3) var(--space-5)',
            background: 'var(--color-neutral-0)',
            borderTop: '1px solid var(--color-neutral-200)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 10,
          }}
        >
          <div
            style={{
              maxWidth: 'var(--size-containerSm)',
              margin: '0 auto',
            }}
          >
            <Button type="submit" variant="primary" size="lg" fullWidth disabled={!canSubmit}>
              {isPending ? 'Reservando…' : 'Confirmar reserva'}
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 44,
  padding: '0 12px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-neutral-300)',
  fontSize: 16,
  fontFamily: 'inherit',
  background: 'var(--color-neutral-0)',
  color: 'var(--color-neutral-900)',
  boxSizing: 'border-box',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--color-neutral-900)' }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 14, color: 'var(--color-neutral-700)' }}>
        {label}
        {required ? <span style={{ color: 'var(--color-semantic-danger)' }}> *</span> : null}
      </span>
      {children}
    </label>
  );
}

function PartyStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const btn: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-pill)',
    border: '1px solid var(--color-neutral-300)',
    background: 'var(--color-neutral-0)',
    color: 'var(--color-neutral-900)',
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <button
        type="button"
        aria-label="Disminuir personas"
        style={btn}
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
      >
        −
      </button>
      <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 700, fontSize: 18 }}>
        {value}
      </span>
      <button
        type="button"
        aria-label="Aumentar personas"
        style={btn}
        onClick={() => onChange(Math.min(20, value + 1))}
        disabled={value >= 20}
      >
        +
      </button>
      <span style={{ marginLeft: 'var(--space-2)', color: 'var(--color-neutral-500)', fontSize: 14 }}>
        {value === 1 ? 'persona' : 'personas'}
      </span>
    </div>
  );
}
