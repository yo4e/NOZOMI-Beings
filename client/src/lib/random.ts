/** Local keyed RNG v1: unsigned 32-bit seed + JSON-encoded coordinates.
 * Stateless draws keep IDs and unrelated random purposes out of the stream.
 */
export function random01(
  seed: number,
  coordinate: readonly (string | number)[],
): number {
  let hash = (0x811c9dc5 ^ (seed >>> 0)) >>> 0;
  const key = JSON.stringify(coordinate);
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  let value = (hash + 0x6d2b79f5) >>> 0;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
}
