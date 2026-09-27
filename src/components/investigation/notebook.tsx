"use client";

import { Button } from "@/components/ui/button";
import { dietLabel, type Notebook, type NoteMark, type Statement, type Suspect } from "@/lib/game";
import { AnimalMark } from "@/components/animal-mark";
import { cn } from "@/lib/utils";

function cycle(current: NoteMark): NoteMark {
  if (current === "unknown") return "yes";
  if (current === "yes") return "no";
  return "unknown";
}

export function NotebookPanel({
  suspects,
  statements,
  notes,
  onChange,
}: {
  suspects: Suspect[];
  statements: Statement[];
  notes: Notebook;
  onChange: (id: string, patch: Partial<Notebook[string]>) => void;
}) {
  return (
    <div className="paper-card flex min-h-0 flex-1 flex-col rounded-xl">
      <div className="border-b px-4 py-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Cuaderno
        </p>
        <h2 className="font-heading text-xl">Hipótesis</h2>
        <p className="text-xs text-muted-foreground">
          Marca lo que creas. No se envía hasta acusar.
        </p>
      </div>
      <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {suspects.map((suspect) => {
          const stmt = statements.find((s) => s.speakerId === suspect.id);
          const note = notes[suspect.id] ?? { guilty: "unknown", lying: "unknown" };
          return (
            <li
              key={suspect.id}
              className="rounded-xl border border-border/80 bg-background/50 p-2.5"
            >
              <div className="flex items-center gap-2">
                <AnimalMark suspect={suspect} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-tight">{suspect.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {suspect.heightCm} cm · {dietLabel(suspect.diet)}
                  </p>
                </div>
              </div>
              {stmt && (
                <p className="mt-2 text-xs leading-snug text-foreground/90">
                  «{stmt.text}»
                </p>
              )}
              <div className="mt-2 flex gap-1.5">
                <MarkButton
                  label="Culpable"
                  value={note.guilty}
                  yesClass="bg-primary text-primary-foreground"
                  onClick={() =>
                    onChange(suspect.id, { guilty: cycle(note.guilty) })
                  }
                />
                <MarkButton
                  label="Miente"
                  value={note.lying}
                  yesClass="bg-ink text-primary-foreground"
                  onClick={() =>
                    onChange(suspect.id, { lying: cycle(note.lying) })
                  }
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MarkButton({
  label,
  value,
  yesClass,
  onClick,
}: {
  label: string;
  value: NoteMark;
  yesClass: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(
        "flex-1",
        value === "yes" && yesClass,
        value === "no" && "line-through opacity-60",
      )}
    >
      {value === "unknown" ? label : value === "yes" ? label : `No ${label.toLowerCase()}`}
    </Button>
  );
}
