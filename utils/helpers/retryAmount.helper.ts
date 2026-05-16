/**
 * Devuelve un monto ligeramente distinto en cada reintento para evitar
 * fallar repetidamente con el mismo valor exacto.
 *
 * retry 0 → base sin cambio
 * retry 1 → base + 2  (por encima)
 * retry 2 → base - 1  (por debajo)
 * (cicla a partir del retry 3)
 *
 * Si base es undefined devuelve undefined (el test usará su lógica random).
 */
export function getRetryAmount(
  base: string | undefined,
  retry: number
): string | undefined {
  if (!base) return undefined;
  if (retry === 0) return base;
  const n = parseInt(base, 10);
  const offsets = [2, -1];
  return String(n + offsets[(retry - 1) % offsets.length]);
}
