import type { Assignment, Predicate, Statement, Suspect } from "./types";

export function indexOf(suspects: Suspect[], id: string): number {
  const i = suspects.findIndex((s) => s.id === id);
  if (i < 0) throw new Error(`No está en el corro: ${id}`);
  return i;
}

export function neighborsOf(
  suspects: Suspect[],
  speakerId: string,
): [Suspect, Suspect] {
  const i = indexOf(suspects, speakerId);
  const n = suspects.length;
  return [suspects[(i - 1 + n) % n], suspects[(i + 1) % n]];
}

export function culprits(suspects: Suspect[], assignment: Assignment): Suspect[] {
  return suspects.filter((s) => assignment[s.id]?.guilty);
}

export function liars(suspects: Suspect[], assignment: Assignment): Suspect[] {
  return suspects.filter((s) => assignment[s.id]?.lying);
}

function anyCulprit(
  suspects: Suspect[],
  assignment: Assignment,
  pred: (s: Suspect) => boolean,
): boolean {
  return culprits(suspects, assignment).some(pred);
}

function allCulprits(
  suspects: Suspect[],
  assignment: Assignment,
  pred: (s: Suspect) => boolean,
): boolean {
  const list = culprits(suspects, assignment);
  return list.length > 0 && list.every(pred);
}

export function evaluatePredicate(
  predicate: Predicate,
  speakerId: string,
  suspects: Suspect[],
  assignment: Assignment,
): boolean {
  const speaker = suspects[indexOf(suspects, speakerId)];
  const [left, right] = neighborsOf(suspects, speakerId);
  const byHeight = [...suspects].sort((a, b) => b.heightCm - a.heightCm);
  const tallest = byHeight[0];
  const shortest = byHeight[byHeight.length - 1];

  switch (predicate.kind) {
    case "guilty":
      return Boolean(assignment[predicate.targetId]?.guilty);
    case "innocent":
      return !assignment[predicate.targetId]?.guilty;
    case "lying":
      return Boolean(assignment[predicate.targetId]?.lying);
    case "truthful":
      return !assignment[predicate.targetId]?.lying;
    case "both_lying":
      return Boolean(
        assignment[predicate.a]?.lying && assignment[predicate.b]?.lying,
      );
    case "or_lying":
      return Boolean(
        assignment[predicate.a]?.lying || assignment[predicate.b]?.lying,
      );
    case "or_guilty":
      return Boolean(
        assignment[predicate.a]?.guilty || assignment[predicate.b]?.guilty,
      );
    case "both_guilty":
      return Boolean(
        assignment[predicate.a]?.guilty && assignment[predicate.b]?.guilty,
      );
    case "exactly_one_guilty": {
      const a = Boolean(assignment[predicate.a]?.guilty);
      const b = Boolean(assignment[predicate.b]?.guilty);
      return a !== b;
    }
    case "self_guilty":
      return Boolean(assignment[speakerId]?.guilty);
    case "self_innocent":
      return !assignment[speakerId]?.guilty;
    case "carnivore_guilty":
      return anyCulprit(suspects, assignment, (s) => s.diet === "carnivore");
    case "herbivore_guilty":
      return anyCulprit(suspects, assignment, (s) => s.diet === "herbivore");
    case "taller_than_speaker_guilty":
      return anyCulprit(
        suspects,
        assignment,
        (s) => s.heightCm > speaker.heightCm,
      );
    case "shorter_than_speaker_guilty":
      return anyCulprit(
        suspects,
        assignment,
        (s) => s.heightCm < speaker.heightCm,
      );
    case "taller_than_cm_guilty":
      return anyCulprit(suspects, assignment, (s) => s.heightCm > predicate.cm);
    case "shorter_than_cm_guilty":
      return anyCulprit(suspects, assignment, (s) => s.heightCm < predicate.cm);
    case "neighbor_guilty":
      return Boolean(
        assignment[left.id]?.guilty || assignment[right.id]?.guilty,
      );
    case "both_neighbors_guilty":
      return Boolean(
        assignment[left.id]?.guilty && assignment[right.id]?.guilty,
      );
    case "left_guilty":
      return Boolean(assignment[left.id]?.guilty);
    case "right_guilty":
      return Boolean(assignment[right.id]?.guilty);
    case "neighbor_lying":
      return Boolean(assignment[left.id]?.lying || assignment[right.id]?.lying);
    case "tallest_guilty":
      return Boolean(assignment[tallest.id]?.guilty);
    case "shortest_guilty":
      return Boolean(assignment[shortest.id]?.guilty);
    case "tallest_lying":
      return Boolean(assignment[tallest.id]?.lying);
    case "shortest_lying":
      return Boolean(assignment[shortest.id]?.lying);
    case "same_diet_guilty":
      return anyCulprit(suspects, assignment, (s) => s.diet === speaker.diet);
    case "other_diet_guilty":
      return anyCulprit(suspects, assignment, (s) => s.diet !== speaker.diet);
    case "all_culprits_carnivore":
      return allCulprits(suspects, assignment, (s) => s.diet === "carnivore");
    case "all_culprits_herbivore":
      return allCulprits(suspects, assignment, (s) => s.diet === "herbivore");
    case "carnivore_lying":
      return suspects.some(
        (s) => s.diet === "carnivore" && assignment[s.id]?.lying,
      );
    case "herbivore_lying":
      return suspects.some(
        (s) => s.diet === "herbivore" && assignment[s.id]?.lying,
      );
    default: {
      const _never: never = predicate;
      throw new Error(`Predicado desconocido: ${JSON.stringify(_never)}`);
    }
  }
}

export function statementHolds(
  statement: Statement,
  suspects: Suspect[],
  assignment: Assignment,
): boolean {
  const truth = evaluatePredicate(
    statement.predicate,
    statement.speakerId,
    suspects,
    assignment,
  );
  const lying = Boolean(assignment[statement.speakerId]?.lying);
  return lying ? !truth : truth;
}

export function assignmentFitsStatements(
  statements: Statement[],
  suspects: Suspect[],
  assignment: Assignment,
): boolean {
  return statements.every((st) => statementHolds(st, suspects, assignment));
}
