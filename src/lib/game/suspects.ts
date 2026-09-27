import type { Suspect } from "./types";

/** Circle order: sospechoso 1 … 7. Original animals, heights and diets. */
export const SUSPECTS: Suspect[] = [
  {
    id: "lince",
    name: "Lince",
    article: "el",
    heightCm: 178,
    diet: "carnivore",
    hue: "#c47a2c",
    mark: "lince",
  },
  {
    id: "cisne",
    name: "Cisne",
    article: "el",
    heightCm: 169,
    diet: "herbivore",
    hue: "#6b7c8a",
    mark: "cisne",
  },
  {
    id: "toro",
    name: "Toro",
    article: "el",
    heightCm: 198,
    diet: "herbivore",
    hue: "#8b2e2e",
    mark: "toro",
  },
  {
    id: "nutria",
    name: "Nutria",
    article: "la",
    heightCm: 152,
    diet: "carnivore",
    hue: "#6b4a32",
    mark: "nutria",
  },
  {
    id: "nandu",
    name: "Ñandú",
    article: "el",
    heightCm: 186,
    diet: "herbivore",
    hue: "#7a6b4a",
    mark: "nandu",
  },
  {
    id: "gavilan",
    name: "Gavilán",
    article: "el",
    heightCm: 164,
    diet: "carnivore",
    hue: "#3d5a73",
    mark: "gavilan",
  },
  {
    id: "tapir",
    name: "Tapir",
    article: "el",
    heightCm: 174,
    diet: "herbivore",
    hue: "#4a5c3a",
    mark: "tapir",
  },
];

export function the(suspect: Suspect): string {
  return `${suspect.article} ${suspect.name}`;
}

export function The(suspect: Suspect): string {
  const article = suspect.article === "el" ? "El" : "La";
  return `${article} ${suspect.name}`;
}

export function byId(id: string): Suspect {
  const found = SUSPECTS.find((s) => s.id === id);
  if (!found) throw new Error(`Sospechoso desconocido: ${id}`);
  return found;
}

export function suspectsForCount(count: number): Suspect[] {
  return SUSPECTS.slice(0, count);
}

export function dietLabel(diet: Suspect["diet"]): string {
  return diet === "carnivore" ? "carnívoro" : "herbívoro";
}

export function dietLabelPlural(diet: Suspect["diet"]): string {
  return diet === "carnivore" ? "carnívoros" : "herbívoros";
}
