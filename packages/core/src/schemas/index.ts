import { z } from 'zod';

export const moneySchema = z.object({
  amount: z.number().int().nonnegative(),
  currency: z.literal('MXN'),
});

export const reservationInputSchema = z.object({
  guestName: z.string().min(2).max(80),
  phone: z.string().min(8).max(20),
  partySize: z.number().int().min(1).max(20),
  slotAt: z.string().datetime(),
  notes: z.string().max(500).optional(),
});

export type ReservationInput = z.infer<typeof reservationInputSchema>;

export const checkoutInputSchema = z.object({
  fulfillment: z.enum(['delivery', 'pickup']),
  addressId: z.string().uuid().nullable(),
  scheduledFor: z.string().datetime(),
  notes: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        qty: z.number().int().min(1).max(20),
        selectedOptions: z.array(
          z.object({
            optionId: z.string().uuid(),
            valueIds: z.array(z.string().uuid()),
          }),
        ),
      }),
    )
    .min(1),
});

export type CheckoutInput = z.infer<typeof checkoutInputSchema>;
