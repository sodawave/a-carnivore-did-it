/** Mulberry32 — deterministic [0, 1) generator. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickIndex(rng: () => number, length: number): number {
  return Math.floor(rng() * length);
}

export function pickOne<T>(rng: () => number, items: T[]): T {
  if (items.length === 0) throw new Error("pickOne: lista vacía");
  return items[pickIndex(rng, items.length)];
}

export function shuffle<T>(rng: () => number, items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = pickIndex(rng, i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
