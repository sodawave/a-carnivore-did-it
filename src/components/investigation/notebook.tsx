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
  notes,
  onChange,
}: {
  suspects: Suspect[];
  statements: Statement[];
  notes: Notebook;
  onChange: (id: string, patch: Partial<Notebook[string]>) => void;
}) {
  return (
    <div className="paper-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg">
      <div className="flex shrink-0 items-baseline justify-between gap-2 border-b px-2 py-1">
        <div>
          <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            Cuaderno
          </p>
          <h2 className="font-heading text-sm leading-tight">Hipótesis</h2>
        </div>
        <p className="text-[10px] text-muted-foreground">Marca y acusa.</p>
      </div>
      <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto p-1.5">
        {suspects.map((suspect) => {
          const note = notes[suspect.id] ?? { guilty: "unknown", lying: "unknown" };
          return (
            <li
              key={suspect.id}
              className="rounded-md border border-border/80 bg-background/50 px-1.5 py-1"
            >
              <div className="flex items-center gap-1.5">
                <AnimalMark suspect={suspect} size={22} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium leading-tight">{suspect.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {suspect.heightCm} cm · {dietLabel(suspect.diet)}
                  </p>
                </div>
              </div>
              <div className="mt-1 flex gap-1">
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
      size="xs"
      onClick={onClick}
      className={cn(
        "h-6 flex-1 text-[11px]",
        value === "yes" && yesClass,
        value === "no" && "line-through opacity-60",
      )}
    >
      {value === "unknown" ? label : value === "yes" ? label : `No ${label.toLowerCase()}`}
    </Button>
  );
}
