import { evaluatePredicate } from "./evaluate";
import { hashSeed, mulberry32, pickOne, shuffle } from "./rng";
import { combinations, liarCountsFor, solveCase } from "./solver";
import { usefulStatementsForSpeaker } from "./statements";
import { suspectsForCount } from "./suspects";
import type { Assignment, Dossier, GameCase, Statement, Suspect } from "./types";

function sampleAssignments(suspects: Suspect[], dossier: Dossier): Assignment[] {
  const ids = suspects.map((s) => s.id);
  const samples: Assignment[] = [];
  for (const guiltyIds of combinations(ids, dossier.culpritCount)) {
    const guilty = new Set(guiltyIds);
    for (const liarN of liarCountsFor(dossier, suspects.length)) {
      for (const liarIds of combinations(ids, liarN)) {
        const lying = new Set(liarIds);
        const assignment: Assignment = {};
        for (const id of ids) {
          assignment[id] = {
            guilty: guilty.has(id),
            lying: lying.has(id),
          };
        }
        samples.push(assignment);
      }
    }
  }
  return samples;
}

function pickSecret(
  rng: () => number,
  suspects: Suspect[],
  dossier: Dossier,
): Assignment {
  const ids = suspects.map((s) => s.id);
  const guiltyIds = pickOne(rng, combinations(ids, dossier.culpritCount));
  const liarN = pickOne(rng, liarCountsFor(dossier, suspects.length));
  const liarIds = pickOne(rng, combinations(ids, liarN));
  const guilty = new Set(guiltyIds);
  const lying = new Set(liarIds);
  const assignment: Assignment = {};
  for (const id of ids) {
    assignment[id] = { guilty: guilty.has(id), lying: lying.has(id) };
  }
  return assignment;
}

export function generateCase(
  dossier: Dossier,
  seedKey: string,
  maxAttempts = 2500,
): GameCase {
  const rng = mulberry32(hashSeed(seedKey));
  const suspects = suspectsForCount(dossier.suspectCount);
  const universe = sampleAssignments(suspects, dossier);
  const catalogs = new Map(
    suspects.map((speaker) => [
      speaker.id,
      usefulStatementsForSpeaker(
        speaker,
        suspects,
        dossier.culpritCount,
        universe,
      ),
    ]),
  );

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const secret = pickSecret(rng, suspects, dossier);
    const statements: Statement[] = [];
    let stalled = false;

    for (const speaker of suspects) {
      const pool = catalogs.get(speaker.id) ?? [];
      const consistent = pool.filter((st) => {
        const truth = evaluatePredicate(
          st.predicate,
          speaker.id,
          suspects,
          secret,
        );
        return secret[speaker.id].lying ? !truth : truth;
      });
      if (consistent.length === 0) {
        stalled = true;
        break;
      }
      statements.push(pickOne(rng, shuffle(rng, consistent).slice(0, 12)));
    }

    if (stalled) continue;

    const solutions = solveCase(suspects, statements, dossier);
    if (solutions.length === 1) {
      return {
        id: seedKey,
        dossierId: dossier.id,
        suspectIds: suspects.map((s) => s.id),
        statements,
        solution: solutions[0],
      };
    }
  }

  throw new Error(
    `No se encontró un caso de solución única para el dosier ${dossier.id} (semilla ${seedKey}).`,
  );
}

export function caseSeed(kind: "open" | "campaign" | "tutorial", dossierId: number, caseId: number): string {
  return `carnivoro:${kind}:d${dossierId}:c${caseId}`;
}
