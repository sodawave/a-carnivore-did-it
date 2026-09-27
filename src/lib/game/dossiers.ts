import type { Dossier } from "./types";

export const DOSSIERS: Dossier[] = [
  {
    id: 1,
    title: "Tres en el patio",
    blurb: "Un corro corto. Una sola mentira. El primer expediente de cualquier detective.",
    suspectCount: 3,
    culpritCount: 1,
    honesty: "lies",
    countMin: 1,
    countMax: 1,
    timers: [90, 180, 270],
  },
  {
    id: 2,
    title: "Mentiras a medias",
    blurb: "Siguen siendo tres, pero ahora puede haber una o dos mentiras.",
    suspectCount: 3,
    culpritCount: 1,
    honesty: "lies",
    countMin: 1,
    countMax: 2,
    timers: [120, 210, 300],
  },
  {
    id: 3,
    title: "Cuatro en corro",
    blurb: "Entra un cuarto sospechoso. Una mentira, un culpable.",
    suspectCount: 4,
    culpritCount: 1,
    honesty: "lies",
    countMin: 1,
    countMax: 1,
    timers: [120, 240, 360],
  },
  {
    id: 4,
    title: "Dos verdades",
    blurb: "Cuatro voces. Exactamente dos dicen la verdad.",
    suspectCount: 4,
    culpritCount: 1,
    honesty: "truths",
    countMin: 2,
    countMax: 2,
    timers: [150, 270, 390],
  },
  {
    id: 5,
    title: "Cinco sombras",
    blurb: "El corro se ensancha. Dos mentiras cruzan el patio.",
    suspectCount: 5,
    culpritCount: 1,
    honesty: "lies",
    countMin: 2,
    countMax: 2,
    timers: [180, 300, 420],
  },
  {
    id: 6,
    title: "Verdades escasas",
    blurb: "Cinco sospechosos y solo una o dos verdades. El resto miente.",
    suspectCount: 5,
    culpritCount: 1,
    honesty: "truths",
    countMin: 1,
    countMax: 2,
    timers: [180, 330, 480],
  },
  {
    id: 7,
    title: "El corro ancho",
    blurb: "Seis en círculo. Tres mentiras. Hay que mirar a los vecinos.",
    suspectCount: 6,
    culpritCount: 1,
    honesty: "lies",
    countMin: 3,
    countMax: 3,
    timers: [210, 360, 510],
  },
  {
    id: 8,
    title: "Mesa completa",
    blurb: "Los siete. Dos o tres mienten. El expediente de cierre de campaña.",
    suspectCount: 7,
    culpritCount: 1,
    honesty: "lies",
    countMin: 2,
    countMax: 3,
    timers: [240, 420, 600],
  },
  {
    id: 9,
    title: "Dos culpables",
    blurb: "A partir de aquí el patio no esconde a uno: esconde a dos.",
    suspectCount: 4,
    culpritCount: 2,
    honesty: "lies",
    countMin: 1,
    countMax: 1,
    timers: [180, 330, 480],
  },
  {
    id: 10,
    title: "Cómplices",
    blurb: "Cinco sospechosos, dos culpables, dos mentiras.",
    suspectCount: 5,
    culpritCount: 2,
    honesty: "lies",
    countMin: 2,
    countMax: 2,
    timers: [210, 360, 540],
  },
  {
    id: 11,
    title: "La manada",
    blurb: "Seis en corro y dos culpables. Mentiras en rango.",
    suspectCount: 6,
    culpritCount: 2,
    honesty: "lies",
    countMin: 2,
    countMax: 3,
    timers: [240, 420, 600],
  },
  {
    id: 12,
    title: "El último expediente",
    blurb: "Mesa completa, dos culpables, tres mentiras. Solo para inspectores.",
    suspectCount: 7,
    culpritCount: 2,
    honesty: "lies",
    countMin: 3,
    countMax: 3,
    timers: [300, 480, 660],
  },
];

export const CAMPAIGN_DOSSIER_IDS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export const OPEN_CASE_COUNT = 20;

export function dossierById(id: number): Dossier {
  const found = DOSSIERS.find((d) => d.id === id);
  if (!found) throw new Error(`Dosier desconocido: ${id}`);
  return found;
}

export function honestyLabel(dossier: Dossier): string {
  const range =
    dossier.countMin === dossier.countMax
      ? String(dossier.countMin)
      : `${dossier.countMin}–${dossier.countMax}`;
  return dossier.honesty === "lies"
    ? `${range} mentira${dossier.countMax === 1 ? "" : "s"}`
    : `${range} verdad${dossier.countMax === 1 ? "" : "es"}`;
}
