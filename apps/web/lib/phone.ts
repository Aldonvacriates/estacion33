// Normalize phone numbers to digits-only E.164-style for `wa.me` links.
// `wa.me` strips the leading `+` anyway, so we return digits only.
//
// Mexican numbers usually arrive in one of these formats from form input:
//   "+52 1 733 107 4642", "+527331074642", "733 107 4642", "7331074642".
// We strip non-digits, drop a leading "00" international prefix if any,
// and prepend the default country code when the input looks domestic.
export function toE164Digits(raw: string, defaultCountry = '52'): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  // Already prefixed with country code (e.g. "521..." or "52..."). 10 digits =
  // domestic Mexican number, prepend 52.
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.length === 10) return `${defaultCountry}${digits}`;
  return digits;
}
