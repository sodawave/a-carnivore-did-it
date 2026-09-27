import { evaluatePredicate, indexOf, neighborsOf } from "./evaluate";
import { dietLabel, The, the } from "./suspects";
import type { Assignment, Predicate, Statement, Suspect } from "./types";

function others(suspects: Suspect[], speakerId: string): Suspect[] {
  return suspects.filter((s) => s.id !== speakerId);
}

function pairs<T>(items: T[]): [T, T][] {
  const out: [T, T][] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      out.push([items[i], items[j]]);
    }
  }
  return out;
}

function heightCuts(suspects: Suspect[]): number[] {
  const heights = [...new Set(suspects.map((s) => s.heightCm))].sort(
    (a, b) => a - b,
  );
  const cuts: number[] = [];
  for (let i = 0; i < heights.length - 1; i++) {
    const mid = Math.floor((heights[i] + heights[i + 1]) / 2);
    if (mid > heights[i] && mid < heights[i + 1] && !cuts.includes(mid)) {
      cuts.push(mid);
    }
  }
  return cuts;
}

export function renderPredicate(
  predicate: Predicate,
  speakerId: string,
  suspects: Suspect[],
): string {
  const speaker = suspects[indexOf(suspects, speakerId)];
  const [left, right] = neighborsOf(suspects, speakerId);
  const find = (id: string) => suspects[indexOf(suspects, id)];

  switch (predicate.kind) {
    case "guilty":
      return `${The(find(predicate.targetId))} lo hizo.`;
    case "innocent":
      return `${The(find(predicate.targetId))} es inocente.`;
    case "lying":
      return `${The(find(predicate.targetId))} miente.`;
    case "truthful":
      return `${The(find(predicate.targetId))} dice la verdad.`;
    case "both_lying":
      return `${The(find(predicate.a))} y ${the(find(predicate.b))} mienten.`;
    case "or_lying":
      return `${The(find(predicate.a))} o ${the(find(predicate.b))} miente (o ambos).`;
    case "or_guilty":
      return `${The(find(predicate.a))} o ${the(find(predicate.b))} lo hizo (o ambos).`;
    case "both_guilty":
      return `${The(find(predicate.a))} y ${the(find(predicate.b))} lo hicieron.`;
    case "exactly_one_guilty":
      return `Exactamente uno de estos dos lo hizo: ${the(find(predicate.a))} o ${the(find(predicate.b))}.`;
    case "self_guilty":
      return "Yo lo hice.";
    case "self_innocent":
      return "Yo no fui.";
    case "carnivore_guilty":
      return "Un carnívoro lo hizo.";
    case "herbivore_guilty":
      return "Un herbívoro lo hizo.";
    case "taller_than_speaker_guilty":
      return "Alguien más alto que yo lo hizo.";
    case "shorter_than_speaker_guilty":
      return "Alguien más bajo que yo lo hizo.";
    case "taller_than_cm_guilty":
      return `Alguien más alto que ${predicate.cm} cm lo hizo.`;
    case "shorter_than_cm_guilty":
      return `Alguien más bajo que ${predicate.cm} cm lo hizo.`;
    case "neighbor_guilty":
      return "Alguien a mi lado lo hizo.";
    case "both_neighbors_guilty":
      return "Los dos de mi lado lo hicieron.";
    case "left_guilty":
      return `${The(left)} (a mi izquierda) lo hizo.`;
    case "right_guilty":
      return `${The(right)} (a mi derecha) lo hizo.`;
    case "neighbor_lying":
      return "Alguien a mi lado miente.";
    case "tallest_guilty":
      return "El más alto lo hizo.";
    case "shortest_guilty":
      return "El más bajo lo hizo.";
    case "tallest_lying":
      return "El más alto miente.";
    case "shortest_lying":
      return "El más bajo miente.";
    case "same_diet_guilty":
      return `Alguien de mi dieta (${dietLabel(speaker.diet)}) lo hizo.`;
    case "other_diet_guilty":
      return "Alguien de la otra dieta lo hizo.";
    case "all_culprits_carnivore":
      return "Todos los culpables son carnívoros.";
    case "all_culprits_herbivore":
      return "Todos los culpables son herbívoros.";
    case "carnivore_lying":
      return "Un carnívoro miente.";
    case "herbivore_lying":
      return "Un herbívoro miente.";
    default: {
      const _never: never = predicate;
      throw new Error(`Predicado desconocido: ${JSON.stringify(_never)}`);
    }
  }
}

export function catalogForSpeaker(
  speaker: Suspect,
  suspects: Suspect[],
  culpritCount: number,
): Predicate[] {
  const rest = others(suspects, speaker.id);
  const [left, right] = neighborsOf(suspects, speaker.id);
  const preds: Predicate[] = [
    { kind: "self_guilty" },
    { kind: "self_innocent" },
    { kind: "carnivore_guilty" },
    { kind: "herbivore_guilty" },
    { kind: "taller_than_speaker_guilty" },
    { kind: "shorter_than_speaker_guilty" },
    { kind: "neighbor_guilty" },
    { kind: "left_guilty" },
    { kind: "right_guilty" },
    { kind: "neighbor_lying" },
    { kind: "tallest_guilty" },
    { kind: "shortest_guilty" },
    { kind: "tallest_lying" },
    { kind: "shortest_lying" },
    { kind: "same_diet_guilty" },
    { kind: "other_diet_guilty" },
    { kind: "all_culprits_carnivore" },
    { kind: "all_culprits_herbivore" },
    { kind: "carnivore_lying" },
    { kind: "herbivore_lying" },
  ];

  if (culpritCount >= 2) {
    preds.push({ kind: "both_neighbors_guilty" });
  }

  for (const other of rest) {
    preds.push({ kind: "guilty", targetId: other.id });
    preds.push({ kind: "innocent", targetId: other.id });
    preds.push({ kind: "lying", targetId: other.id });
    preds.push({ kind: "truthful", targetId: other.id });
  }

  for (const [a, b] of pairs(rest)) {
    preds.push({ kind: "both_lying", a: a.id, b: b.id });
    preds.push({ kind: "or_lying", a: a.id, b: b.id });
    preds.push({ kind: "or_guilty", a: a.id, b: b.id });
    preds.push({ kind: "exactly_one_guilty", a: a.id, b: b.id });
    if (culpritCount >= 2) {
      preds.push({ kind: "both_guilty", a: a.id, b: b.id });
    }
  }

  for (const cm of heightCuts(suspects)) {
    preds.push({ kind: "taller_than_cm_guilty", cm });
    preds.push({ kind: "shorter_than_cm_guilty", cm });
  }

  void left;
  void right;
  return preds;
}

function predicateVaries(
  predicate: Predicate,
  speakerId: string,
  suspects: Suspect[],
  sampleAssignments: Assignment[],
): boolean {
  let seenTrue = false;
  let seenFalse = false;
  for (const assignment of sampleAssignments) {
    const value = evaluatePredicate(
      predicate,
      speakerId,
      suspects,
      assignment,
    );
    if (value) seenTrue = true;
    else seenFalse = true;
    if (seenTrue && seenFalse) return true;
  }
  return false;
}

export function usefulStatementsForSpeaker(
  speaker: Suspect,
  suspects: Suspect[],
  culpritCount: number,
  sampleAssignments: Assignment[],
): Statement[] {
  return catalogForSpeaker(speaker, suspects, culpritCount)
    .filter((predicate) =>
      predicateVaries(predicate, speaker.id, suspects, sampleAssignments),
    )
    .map((predicate) => ({
      speakerId: speaker.id,
      predicate,
      text: renderPredicate(predicate, speaker.id, suspects),
    }));
}
