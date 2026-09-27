export function starsForElapsed(
  elapsedSec: number,
  timers: [number, number, number],
  correct: boolean,
): number {
  if (!correct) return 0;
  if (elapsedSec <= timers[0]) return 3;
  if (elapsedSec <= timers[1]) return 2;
  if (elapsedSec <= timers[2]) return 1;
  return 0;
}

export function formatClock(totalSec: number): string {
  const sec = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export type RankId =
  | "aspirante"
  | "cadete"
  | "novato"
  | "oficial"
  | "detective"
  | "perfilador"
  | "inspector";

export type Rank = {
  id: RankId;
  label: string;
  minScore: number;
};

export const RANKS: Rank[] = [
  { id: "inspector", label: "Inspector", minScore: 22 },
  { id: "perfilador", label: "Perfilador", minScore: 19 },
  { id: "detective", label: "Detective", minScore: 16 },
  { id: "oficial", label: "Oficial", minScore: 13 },
  { id: "novato", label: "Novato", minScore: 10 },
  { id: "cadete", label: "Cadete", minScore: 7 },
  { id: "aspirante", label: "Aspirante", minScore: 0 },
];

export function rankForScore(score: number): Rank {
  return RANKS.find((r) => score >= r.minScore) ?? RANKS[RANKS.length - 1];
}

export function campaignScore(stars: number[], badgesUsed: number): number {
  const total = stars.reduce((a, b) => a + b, 0);
  return Math.max(0, total - badgesUsed);
}
