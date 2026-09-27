"use client";

import { useMemo, useState } from "react";
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

  const statementsBySpeaker = useMemo(
    () => new Map(game.statements.map((st) => [st.speakerId, st])),
    [game.statements],
  );

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
      <div className="mx-auto w-full max-w-3xl p-6">
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
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {banner}
      <div className="grid min-h-0 flex-1 xl:grid-cols-[1fr_380px]">
        <section className="flex min-h-0 flex-col p-4 xl:p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline">Dosier {String(dossier.id).padStart(2, "0")}</Badge>
            <h1 className="font-heading text-2xl">{dossier.title}</h1>
            <span className="text-sm text-muted-foreground">
              {dossier.suspectCount} sospechosos · {dossier.culpritCount}{" "}
              {dossier.culpritCount === 1 ? "culpable" : "culpables"} ·{" "}
              {honestyLabel(dossier)}
            </span>
          </div>
          <div className="flex min-h-[640px] flex-1 items-center justify-center overflow-visible rounded-[2rem] bg-secondary/40 p-4">
            <SuspectCircle
              suspects={suspects}
              statements={game.statements}
              notes={notes}
            />
          </div>
          <ol className="mt-4 grid gap-2 md:grid-cols-2">
            {suspects.map((s, i) => {
              const stmt = statementsBySpeaker.get(s.id);
              return (
                <li
                  key={s.id}
                  className="rounded-xl border border-border/70 bg-card/80 px-3 py-2 text-sm"
                >
                  <span className="text-xs text-muted-foreground">
                    {i + 1}. {s.name}
                  </span>
                  <p className="leading-snug">«{stmt?.text}»</p>
                </li>
              );
            })}
          </ol>
        </section>
        <aside className="flex min-h-0 flex-col gap-3 border-t border-border/70 bg-card/50 p-4 xl:border-t-0 xl:border-l">
          {hint}
          <TimerPanel elapsedSec={elapsed} dossier={dossier} />
          <NotebookPanel
            suspects={suspects}
            statements={game.statements}
            notes={notes}
            onChange={patchNote}
          />
          <Button size="lg" className="w-full" onClick={() => setAccuseOpen(true)}>
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
