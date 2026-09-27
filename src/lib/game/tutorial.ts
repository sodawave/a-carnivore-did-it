import type { GameCase } from "./types";
import { dossierById } from "./dossiers";

/**
 * Tutorial original (3 sospechosos, 1 mentira, 1 culpable).
 * Misma forma lógica que el ejemplo pedagógico del reglamento,
 * con sospechosos y umbrales propios: si el Cisne dijera la verdad,
 * Lince y Toro mentirían (2 mentiras), imposible. Luego el Cisne miente
 * y los otros dicen la verdad: el Lince no fue, alguien < 170 cm lo hizo
 * → el culpable es el Cisne.
 */
export function tutorialCase(): GameCase {
  return {
    id: "tutorial",
    dossierId: 1,
    suspectIds: ["lince", "cisne", "toro"],
    statements: [
      {
        speakerId: "lince",
        predicate: { kind: "self_innocent" },
        text: "Yo no fui.",
      },
      {
        speakerId: "cisne",
        predicate: { kind: "both_lying", a: "lince", b: "toro" },
        text: "El Lince y el Toro mienten.",
      },
      {
        speakerId: "toro",
        predicate: { kind: "shorter_than_cm_guilty", cm: 170 },
        text: "Alguien más bajo que 170 cm lo hizo.",
      },
    ],
    solution: {
      lince: { guilty: false, lying: false },
      cisne: { guilty: true, lying: true },
      toro: { guilty: false, lying: false },
    },
  };
}

export const TUTORIAL_DOSSIER = dossierById(1);

export const TUTORIAL_STEPS = [
  {
    title: "Lee el dosier",
    body: "Hay 3 sospechosos, 1 culpable y exactamente 1 mentira. Culpa y honestidad no van juntas: el culpable puede mentir o decir la verdad.",
  },
  {
    title: "Supón que el Cisne dice la verdad",
    body: "Si su frase fuera cierta, el Lince y el Toro mentirían. Eso serían 2 mentiras, y el dosier solo admite 1. Imposible.",
  },
  {
    title: "Entonces el Cisne miente",
    body: "La única mentira es la suya. El Lince y el Toro dicen la verdad: el Lince no fue, y alguien de menos de 170 cm lo hizo.",
  },
  {
    title: "El culpable es el Cisne",
    body: "El Cisne mide 169 cm. Es el único por debajo de 170. Acúsale para cerrar el tutorial.",
  },
] as const;
