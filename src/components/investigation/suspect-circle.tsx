"use client";

import { AnimalMark } from "@/components/animal-mark";
import { Badge } from "@/components/ui/badge";
import { dietLabel, type Notebook, type NoteMark, type Statement, type Suspect } from "@/lib/game";
import { cn } from "@/lib/utils";

export function SuspectCircle({
  suspects,
  statements,
  notes,
  accused = [],
  onToggleAccused,
  selecting,
}: {
  suspects: Suspect[];
  statements: Statement[];
  notes: Notebook;
  accused?: string[];
  onToggleAccused?: (id: string) => void;
  selecting?: boolean;
}) {
  const n = suspects.length;
  const r = n >= 6 ? 30 : n >= 4 ? 28 : 25;
  const cardW = n >= 6 ? 168 : n >= 4 ? 196 : 228;
  const markSize = n >= 6 ? 36 : 42;

  return (
    <div className="absolute top-1/2 left-1/2 aspect-square w-[min(100cqw,100cqh)] -translate-x-1/2 -translate-y-1/2">
      <div className="blotter absolute inset-[22%] rounded-full" />
      <div className="absolute inset-[32%] flex items-center justify-center">
        <div className="text-center">
          <p className="font-heading text-lg leading-none text-primary-foreground/90 drop-shadow">
            La ronda
          </p>
          <p className="mt-1 text-xs text-primary-foreground/70">
            {n} sospechosos
          </p>
        </div>
      </div>
      {suspects.map((suspect, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const left = 50 + Math.cos(angle) * r;
        const top = 50 + Math.sin(angle) * r;
        const stmt = statements.find((s) => s.speakerId === suspect.id);
        const mark = notes[suspect.id];
        const selected = accused.includes(suspect.id);
        return (
          <article
            key={suspect.id}
            className={cn(
              "paper-card absolute -translate-x-1/2 -translate-y-1/2 rounded-xl p-2",
              mark?.guilty === "yes" && "ring-2 ring-primary",
              mark?.guilty === "no" && "opacity-80",
              selected && "ring-2 ring-amber-500",
            )}
            style={{ left: `${left}%`, top: `${top}%`, width: cardW }}
          >
            <div className="flex items-start gap-2">
              <AnimalMark suspect={suspect} size={markSize} />
              <div className="min-w-0">
                <h3 className="font-heading text-base leading-tight">
                  {suspect.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {suspect.heightCm} cm · {dietLabel(suspect.diet)}
                </p>
                <div className="mt-0.5 flex flex-wrap gap-1">
                  <MarkChip label="culpable" value={mark?.guilty} />
                  <MarkChip label="miente" value={mark?.lying} />
                </div>
              </div>
            </div>
            {stmt && (
              <p className="mt-1.5 rounded-md bg-secondary/60 px-2 py-1 text-sm leading-snug">
                «{stmt.text}»
              </p>
            )}
            {selecting && onToggleAccused && (
              <button
                type="button"
                onClick={() => onToggleAccused(suspect.id)}
                className={cn(
                  "mt-1.5 w-full rounded-md border px-2 py-1 text-xs",
                  selected
                    ? "border-amber-600 bg-amber-500/20"
                    : "border-border hover:bg-secondary",
                )}
              >
                {selected ? "En la acusación" : "Señalar"}
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}

function MarkChip({ label, value }: { label: string; value?: NoteMark }) {
  if (!value || value === "unknown") return null;
  return (
    <Badge variant={value === "yes" ? "default" : "outline"} className="h-5 text-xs">
      {value === "yes" ? label : `no ${label}`}
    </Badge>
  );
}
