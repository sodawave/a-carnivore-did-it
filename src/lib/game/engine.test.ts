import { describe, expect, it } from "vitest";
import { assignmentFitsStatements, evaluatePredicate } from "./evaluate";
import { generateCase, caseSeed } from "./generator";
import { DOSSIERS, dossierById } from "./dossiers";
import { solveCase, sameGuiltySet, combinations } from "./solver";
import { campaignScore, rankForScore, starsForElapsed } from "./stars";
import { suspectsForCount, byId } from "./suspects";
import { tutorialCase, TUTORIAL_DOSSIER } from "./tutorial";
import type { Assignment } from "./types";

function assign(
  guilty: string[],
  lying: string[],
  ids: string[],
): Assignment {
  const g = new Set(guilty);
  const l = new Set(lying);
  const out: Assignment = {};
  for (const id of ids) out[id] = { guilty: g.has(id), lying: l.has(id) };
  return out;
}

describe("tutorial", () => {
  it("tiene exactamente una solución: el Cisne culpable y mintiendo", () => {
    const game = tutorialCase();
    const suspects = suspectsForCount(3);
    const solutions = solveCase(suspects, game.statements, TUTORIAL_DOSSIER);
    expect(solutions).toHaveLength(1);
    expect(solutions[0].cisne).toEqual({ guilty: true, lying: true });
    expect(solutions[0].lince).toEqual({ guilty: false, lying: false });
    expect(solutions[0].toro).toEqual({ guilty: false, lying: false });
    expect(game.solution).toEqual(solutions[0]);
  });

  it("encaja con la solución guardada", () => {
    const game = tutorialCase();
    expect(
      assignmentFitsStatements(
        game.statements,
        suspectsForCount(3),
        game.solution,
      ),
    ).toBe(true);
  });
});

describe("evaluador fiel al reglamento", () => {
  const three = suspectsForCount(3);
  const ids = three.map((s) => s.id);

  it("«A y B mienten» es falso si uno dice la verdad", () => {
    const pred = { kind: "both_lying" as const, a: "lince", b: "toro" };
    const bothLie = assign([], ["lince", "toro"], ids);
    const oneTruth = assign([], ["lince"], ids);
    expect(evaluatePredicate(pred, "cisne", three, bothLie)).toBe(true);
    expect(evaluatePredicate(pred, "cisne", three, oneTruth)).toBe(false);
  });

  it("«A o B lo hizo (o ambos)» solo es falso si los dos son inocentes", () => {
    const pred = { kind: "or_guilty" as const, a: "lince", b: "cisne" };
    expect(
      evaluatePredicate(pred, "toro", three, assign(["lince"], [], ids)),
    ).toBe(true);
    expect(
      evaluatePredicate(
        pred,
        "toro",
        three,
        assign(["lince", "cisne"], [], ids),
      ),
    ).toBe(true);
    expect(evaluatePredicate(pred, "toro", three, assign(["toro"], [], ids))).toBe(
      false,
    );
  });

  it("«Un herbívoro lo hizo» es cierto si al menos un culpable lo es", () => {
    const four = suspectsForCount(4);
    const ids4 = four.map((s) => s.id);
    const pred = { kind: "herbivore_guilty" as const };
    expect(
      evaluatePredicate(
        pred,
        "lince",
        four,
        assign(["lince", "cisne"], [], ids4),
      ),
    ).toBe(true);
    expect(
      evaluatePredicate(pred, "lince", four, assign(["lince", "nutria"], [], ids4)),
    ).toBe(false);
  });

  it("«Alguien más alto que yo lo hizo» es falso si el hablante es el único culpable", () => {
    const pred = { kind: "taller_than_speaker_guilty" as const };
    const linceOnly = assign(["lince"], [], ids);
    const toroOnly = assign(["toro"], [], ids);
    expect(evaluatePredicate(pred, "lince", three, linceOnly)).toBe(false);
    expect(evaluatePredicate(pred, "lince", three, toroOnly)).toBe(true);
    expect(evaluatePredicate(pred, "toro", three, linceOnly)).toBe(false);
  });

  it("los vecinos del corro de 4 unen al 1 con el 4", () => {
    const four = suspectsForCount(4);
    const ids4 = four.map((s) => s.id);
    const pred = { kind: "neighbor_guilty" as const };
    expect(
      evaluatePredicate(pred, "lince", four, assign(["nutria"], [], ids4)),
    ).toBe(true);
    expect(
      evaluatePredicate(pred, "lince", four, assign(["cisne"], [], ids4)),
    ).toBe(true);
    expect(
      evaluatePredicate(pred, "lince", four, assign(["toro"], [], ids4)),
    ).toBe(false);
  });
});

describe("estrellas y rango", () => {
  it("reparte 3/2/1/0 según el cronómetro", () => {
    const timers: [number, number, number] = [90, 180, 270];
    expect(starsForElapsed(10, timers, true)).toBe(3);
    expect(starsForElapsed(90, timers, true)).toBe(3);
    expect(starsForElapsed(91, timers, true)).toBe(2);
    expect(starsForElapsed(180, timers, true)).toBe(2);
    expect(starsForElapsed(181, timers, true)).toBe(1);
    expect(starsForElapsed(271, timers, true)).toBe(0);
    expect(starsForElapsed(10, timers, false)).toBe(0);
  });

  it("resta insignias gastadas del total", () => {
    expect(campaignScore([3, 2, 1, 0, 3, 3, 2, 1], 1)).toBe(14);
    expect(rankForScore(14).label).toBe("Oficial");
    expect(rankForScore(22).id).toBe("inspector");
    expect(rankForScore(6).id).toBe("aspirante");
  });
});

describe("acusación", () => {
  it("compara el conjunto de culpables, no el orden", () => {
    const a = assign(["cisne", "lince"], ["toro"], ["lince", "cisne", "toro"]);
    expect(sameGuiltySet(a, ["lince", "cisne"])).toBe(true);
    expect(sameGuiltySet(a, ["cisne"])).toBe(false);
  });
});

describe("generador de solución única", () => {
  it("produce exactamente una solución para cada dosier de campaña", () => {
    for (const dossier of DOSSIERS.slice(0, 8)) {
      const game = generateCase(dossier, caseSeed("campaign", dossier.id, 1));
      const suspects = suspectsForCount(dossier.suspectCount);
      const solutions = solveCase(suspects, game.statements, dossier);
      expect(solutions, `dosier ${dossier.id}`).toHaveLength(1);
      expect(solutions[0]).toEqual(game.solution);
      expect(game.statements).toHaveLength(dossier.suspectCount);
    }
  }, 60_000);

  it("también cierra dosieres con varios culpables", () => {
    const dossier = dossierById(9);
    const game = generateCase(dossier, caseSeed("open", 9, 3));
    const suspects = suspectsForCount(dossier.suspectCount);
    const solutions = solveCase(suspects, game.statements, dossier);
    expect(solutions).toHaveLength(1);
    const guilty = Object.values(solutions[0]).filter((r) => r.guilty);
    expect(guilty).toHaveLength(2);
  }, 30_000);

  it("la misma semilla reproduce el mismo caso", () => {
    const d = dossierById(1);
    const a = generateCase(d, "repeat-me");
    const b = generateCase(d, "repeat-me");
    expect(a.statements).toEqual(b.statements);
    expect(a.solution).toEqual(b.solution);
  });
});

describe("combinaciones", () => {
  it("C(4,2) = 6", () => {
    expect(combinations(["a", "b", "c", "d"], 2)).toHaveLength(6);
  });
});

describe("sospechosos propios", () => {
  it("siete animales con alturas únicas y dietas mixtas", () => {
    const all = suspectsForCount(7);
    expect(all).toHaveLength(7);
    const heights = new Set(all.map((s) => s.heightCm));
    expect(heights.size).toBe(7);
    expect(all.some((s) => s.diet === "carnivore")).toBe(true);
    expect(all.some((s) => s.diet === "herbivore")).toBe(true);
    expect(byId("lince").name).toBe("Lince");
  });
});
