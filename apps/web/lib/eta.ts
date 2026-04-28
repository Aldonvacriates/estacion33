// Distance + ETA helpers used by the customer-side delivery map.
//
// Iguala is small + has narrow streets, so a moto running between Plan de
// Iguala and a customer house averages about 15 km/h once you factor in
// red lights, vendors, and the occasional speed bump. We surface a
// conservative ETA so customers don't get angry when reality is slower
// than the math; we'd rather under-promise.

export type LatLng = { lat: number; lng: number };

const DEFAULT_KMH = 15;
const EARTH_RADIUS_M = 6_371_000;

/**
 * Great-circle distance between two coordinates, in meters.
 * Inputs in degrees.
 */
export function haversineMeters(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/**
 * Returns whole minutes of estimated travel time at `kmh` average speed.
 * Floors to a minimum of 1 minute when the driver is technically already
 * at the door so the UI never displays "0 min" mid-flight.
 */
export function etaMinutes(
  driver: LatLng,
  destination: LatLng,
  kmh: number = DEFAULT_KMH,
): number {
  const meters = haversineMeters(driver, destination);
  const hours = meters / 1000 / kmh;
  const mins = Math.round(hours * 60);
  return Math.max(1, mins);
}

/**
 * Spanish copy for an ETA value. Returns "Llega en ~3 min" or
 * "Llega en menos de 1 min" when the driver is essentially there.
 */
export function formatEtaEs(minutes: number): string {
  if (minutes <= 1) return 'Llega en menos de 1 min';
  if (minutes < 60) return `Llega en ~${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem === 0 ? `Llega en ~${hrs} h` : `Llega en ~${hrs} h ${rem} min`;
}
