import { assignmentFitsStatements } from "./evaluate";
import type { Assignment, Dossier, Statement, Suspect } from "./types";

export function combinations<T>(items: T[], k: number): T[][] {
  const out: T[][] = [];
  const rec = (start: number, acc: T[]) => {
    if (acc.length === k) {
      out.push([...acc]);
      return;
    }
    for (let i = start; i <= items.length - (k - acc.length); i++) {
      acc.push(items[i]);
      rec(i + 1, acc);
      acc.pop();
    }
  };
  rec(0, []);
  return out;
}

export function liarCountsFor(dossier: Dossier, suspectCount: number): number[] {
  const counts: number[] = [];
  if (dossier.honesty === "lies") {
    for (let n = dossier.countMin; n <= dossier.countMax; n++) counts.push(n);
  } else {
    for (let t = dossier.countMin; t <= dossier.countMax; t++) {
      counts.push(suspectCount - t);
    }
  }
  return counts.filter((n) => n >= 0 && n <= suspectCount);
}

export function solveCase(
  suspects: Suspect[],
  statements: Statement[],
  dossier: Dossier,
): Assignment[] {
  const ids = suspects.map((s) => s.id);
  const culpritSets = combinations(ids, dossier.culpritCount);
  const liarNs = liarCountsFor(dossier, suspects.length);
  const valid: Assignment[] = [];

  for (const guiltyIds of culpritSets) {
    const guilty = new Set(guiltyIds);
    for (const liarN of liarNs) {
      for (const liarIds of combinations(ids, liarN)) {
        const lying = new Set(liarIds);
        const assignment: Assignment = {};
        for (const id of ids) {
          assignment[id] = {
            guilty: guilty.has(id),
            lying: lying.has(id),
          };
        }
        if (assignmentFitsStatements(statements, suspects, assignment)) {
          valid.push(assignment);
        }
      }
    }
  }
  return valid;
}

export function guiltyIdsOf(assignment: Assignment): string[] {
  return Object.entries(assignment)
    .filter(([, role]) => role.guilty)
    .map(([id]) => id)
    .sort();
}

export function lyingIdsOf(assignment: Assignment): string[] {
  return Object.entries(assignment)
    .filter(([, role]) => role.lying)
    .map(([id]) => id)
    .sort();
}

export function sameGuiltySet(a: Assignment, accused: string[]): boolean {
  const left = guiltyIdsOf(a);
  const right = [...accused].sort();
  return left.length === right.length && left.every((id, i) => id === right[i]);
}
