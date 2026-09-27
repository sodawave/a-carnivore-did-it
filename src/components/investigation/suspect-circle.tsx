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
  const r = n >= 6 ? 31 : n >= 4 ? 29 : 26;
  const cardW = n >= 6 ? 104 : n >= 4 ? 116 : 124;
  const markSize = n >= 6 ? 26 : 30;

  return (
    <div className="absolute top-1/2 left-1/2 aspect-square w-[min(100cqw,100cqh)] -translate-x-1/2 -translate-y-1/2">
      <div className="blotter absolute inset-[20%] rounded-full" />
        <div className="absolute inset-[30%] flex items-center justify-center">
          <div className="text-center">
            <p className="font-heading text-sm leading-none text-primary-foreground/90 drop-shadow lg:text-base">
              El corro
            </p>
            <p className="mt-0.5 text-[10px] text-primary-foreground/70">
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
                "paper-card absolute -translate-x-1/2 -translate-y-1/2 rounded-lg p-1",
                mark?.guilty === "yes" && "ring-2 ring-primary",
                mark?.guilty === "no" && "opacity-80",
                selected && "ring-2 ring-amber-500",
              )}
              style={{ left: `${left}%`, top: `${top}%`, width: cardW }}
            >
              <div className="flex items-start gap-1">
                <AnimalMark suspect={suspect} size={markSize} />
                <div className="min-w-0">
                  <h3 className="font-heading text-[13px] leading-tight">
                    {suspect.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    {suspect.heightCm} cm · {dietLabel(suspect.diet)}
                  </p>
                  <div className="mt-0.5 flex flex-wrap gap-0.5">
                    <MarkChip label="culpable" value={mark?.guilty} />
                    <MarkChip label="miente" value={mark?.lying} />
                  </div>
                </div>
              </div>
              {stmt && (
                <p className="mt-0.5 line-clamp-2 rounded-md bg-secondary/60 px-1 py-0.5 text-[10px] leading-snug">
                  «{stmt.text}»
                </p>
              )}
              {selecting && onToggleAccused && (
                <button
                  type="button"
                  onClick={() => onToggleAccused(suspect.id)}
                  className={cn(
                    "mt-1 w-full rounded-md border px-1.5 py-0.5 text-[10px]",
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
    <Badge variant={value === "yes" ? "default" : "outline"} className="h-4 text-[9px]">
      {value === "yes" ? label : `no ${label}`}
    </Badge>
  );
}
