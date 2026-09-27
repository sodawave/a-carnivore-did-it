"use client";

import { useState } from "react";
import { AccusationDialog } from "@/components/investigation/accusation-dialog";
import { NotebookPanel } from "@/components/investigation/notebook";
import { ResultPanel } from "@/components/investigation/result-panel";
import { SuspectCircle } from "@/components/investigation/suspect-circle";
import { TimerPanel, useElapsed } from "@/components/investigation/timer-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatClock,
  honestyLabel,
  sameGuiltySet,
  starsForElapsed,
  type Dossier,
  type GameCase,
  type Notebook,
  type Suspect,
  type SuspectNotes,
} from "@/lib/game";
import type { ReactNode } from "react";

function emptyNotes(suspects: Suspect[]): Notebook {
  const start: Notebook = {};
  for (const s of suspects) start[s.id] = { guilty: "unknown", lying: "unknown" };
  return start;
}

export type ResolvePayload = {
  correct: boolean;
  stars: number;
  elapsedSec: number;
  accused: string[];
};

export function InvestigationTable({
  dossier,
  game,
  suspects,
  banner,
  hint,
  onResolved,
  resultActions,
}: {
  dossier: Dossier;
  game: GameCase;
  suspects: Suspect[];
  banner?: ReactNode;
  hint?: ReactNode;
  onResolved?: (payload: ResolvePayload) => void;
  resultActions?: (payload: ResolvePayload) => ReactNode;
}) {
  const [notes, setNotes] = useState<Notebook>(() => emptyNotes(suspects));
  const [accuseOpen, setAccuseOpen] = useState(false);
  const [result, setResult] = useState<ResolvePayload | null>(null);
  const running = result === null;
  const elapsed = useElapsed(running, game.id);

  function patchNote(id: string, patch: Partial<SuspectNotes>) {
    setNotes((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  }

  function confirm(accused: string[]) {
    const elapsedSec = elapsed;
    const correct = sameGuiltySet(game.solution, accused);
    const stars = starsForElapsed(elapsedSec, dossier.timers, correct);
    const payload = { correct, stars, elapsedSec, accused };
    setResult(payload);
    setAccuseOpen(false);
    onResolved?.(payload);
  }

  if (result) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl p-5">
          <ResultPanel
            correct={result.correct}
            stars={result.stars}
            elapsedLabel={formatClock(result.elapsedSec)}
            suspects={suspects}
            solution={game.solution}
            accused={result.accused}
          >
            {resultActions?.(result)}
          </ResultPanel>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {banner}
      <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="flex min-h-0 flex-col gap-2 overflow-hidden p-2.5 lg:p-3">
          <div className="flex shrink-0 flex-wrap items-baseline gap-x-2.5 gap-y-0">
            <Badge variant="outline" className="h-5 text-xs">
              Dosier {String(dossier.id).padStart(2, "0")}
            </Badge>
            <h1 className="font-heading text-lg leading-none">
              {dossier.title}
            </h1>
            <span className="text-xs text-muted-foreground">
              {dossier.suspectCount} sospechosos · {dossier.culpritCount}{" "}
              {dossier.culpritCount === 1 ? "culpable" : "culpables"} ·{" "}
              {honestyLabel(dossier)}
            </span>
          </div>
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-secondary/40 [container-type:size]">
            <SuspectCircle
              suspects={suspects}
              statements={game.statements}
              notes={notes}
            />
          </div>
        </section>
        <aside className="flex min-h-0 flex-col gap-2 overflow-hidden border-t border-border/70 bg-card/50 p-2.5 lg:border-t-0 lg:border-l lg:p-3">
          {hint}
          <TimerPanel elapsedSec={elapsed} dossier={dossier} />
          <NotebookPanel
            suspects={suspects}
            statements={game.statements}
            notes={notes}
            onChange={patchNote}
          />
          <Button className="h-9 w-full shrink-0 text-sm" onClick={() => setAccuseOpen(true)}>
            Acusar
          </Button>
        </aside>
      </div>
      <AccusationDialog
        open={accuseOpen}
        onOpenChange={setAccuseOpen}
        suspects={suspects}
        dossier={dossier}
        onConfirm={confirm}
      />
    </div>
  );
}
