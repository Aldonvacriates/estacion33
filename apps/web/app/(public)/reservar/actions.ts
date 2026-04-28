'use server';

import { z } from 'zod';
import { getServerSupabase } from '@/lib/supabase/server';

const reservationSchema = z.object({
  guestName: z.string().min(2).max(80),
  phone: z.string().min(8).max(20),
  partySize: z.number().int().min(1).max(20),
  slotAt: z.string().datetime(),
  notes: z.string().max(500).optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export type ReservationResult =
  | { ok: true; reservationId: string }
  | { ok: false; error: string };

export async function createReservationAction(
  input: ReservationInput,
): Promise<ReservationResult> {
  const parsed = reservationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'invalid_input' };
  }
  const data = parsed.data;

  const supabase = await getServerSupabase();
  const { data: row, error } = await supabase
    .from('reservations')
    .insert({
      user_id: null, // guest reservation
      guest_name: data.guestName,
      phone: data.phone,
      party_size: data.partySize,
      slot_at: data.slotAt,
      status: 'pending',
      notes: data.notes ?? null,
    })
    .select('id')
    .single();

  if (error || !row) {
    return { ok: false, error: `reservation_insert: ${error?.message ?? 'unknown'}` };
  }
  return { ok: true, reservationId: row.id };
}
