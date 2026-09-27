export type Diet = "carnivore" | "herbivore";

export type Suspect = {
  id: string;
  name: string;
  article: "el" | "la";
  heightCm: number;
  diet: Diet;
  hue: string;
  mark: string;
};

export type Role = {
  guilty: boolean;
  lying: boolean;
};

export type Assignment = Record<string, Role>;

export type HonestyConstraint = "lies" | "truths";

export type Dossier = {
  id: number;
  title: string;
  blurb: string;
  suspectCount: number;
  culpritCount: number;
  honesty: HonestyConstraint;
  countMin: number;
  countMax: number;
  /** Seconds to earn 3, 2 and 1 star. */
  timers: [number, number, number];
};

export type Predicate =
  | { kind: "guilty"; targetId: string }
  | { kind: "innocent"; targetId: string }
  | { kind: "lying"; targetId: string }
  | { kind: "truthful"; targetId: string }
  | { kind: "both_lying"; a: string; b: string }
  | { kind: "or_lying"; a: string; b: string }
  | { kind: "or_guilty"; a: string; b: string }
  | { kind: "both_guilty"; a: string; b: string }
  | { kind: "exactly_one_guilty"; a: string; b: string }
  | { kind: "self_guilty" }
  | { kind: "self_innocent" }
  | { kind: "carnivore_guilty" }
  | { kind: "herbivore_guilty" }
  | { kind: "taller_than_speaker_guilty" }
  | { kind: "shorter_than_speaker_guilty" }
  | { kind: "taller_than_cm_guilty"; cm: number }
  | { kind: "shorter_than_cm_guilty"; cm: number }
  | { kind: "neighbor_guilty" }
  | { kind: "both_neighbors_guilty" }
  | { kind: "left_guilty" }
  | { kind: "right_guilty" }
  | { kind: "neighbor_lying" }
  | { kind: "tallest_guilty" }
  | { kind: "shortest_guilty" }
  | { kind: "tallest_lying" }
  | { kind: "shortest_lying" }
  | { kind: "same_diet_guilty" }
  | { kind: "other_diet_guilty" }
  | { kind: "all_culprits_carnivore" }
  | { kind: "all_culprits_herbivore" }
  | { kind: "carnivore_lying" }
  | { kind: "herbivore_lying" };

export type Statement = {
  speakerId: string;
  predicate: Predicate;
  text: string;
};

export type GameCase = {
  id: string;
  dossierId: number;
  suspectIds: string[];
  statements: Statement[];
  solution: Assignment;
};

export type NoteMark = "unknown" | "yes" | "no";

export type SuspectNotes = {
  guilty: NoteMark;
  lying: NoteMark;
};

export type Notebook = Record<string, SuspectNotes>;
