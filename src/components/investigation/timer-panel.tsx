"use client";

import { useEffect, useRef, useState } from "react";
import { formatClock, starsForElapsed, type Dossier } from "@/lib/game";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function TimerPanel({
  elapsedSec,
  dossier,
  frozen,
}: {
  elapsedSec: number;
  dossier: Dossier;
  frozen?: boolean;
}) {
  const liveStars = starsForElapsed(elapsedSec, dossier.timers, true);
  const [t3, t2, t1] = dossier.timers;
  const max = t1;
  const remaining =
    elapsedSec <= t3
      ? t3 - elapsedSec
      : elapsedSec <= t2
        ? t2 - elapsedSec
        : elapsedSec <= t1
          ? t1 - elapsedSec
          : 0;

  return (
    <div className="paper-card shrink-0 rounded-lg px-2 py-1.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            Cronómetro
          </p>
          <p className="font-heading text-xl leading-none tabular-nums tracking-tight">
            {formatClock(elapsedSec)}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {frozen
              ? "Tiempo cerrado"
              : liveStars === 0
                ? "Fuera de tiempo: 0 estrellas"
                : `${formatClock(remaining)} para conservar ${liveStars}★`}
          </p>
        </div>
        <StarRow count={liveStars} />
      </div>
      <Progress value={Math.min(100, (elapsedSec / max) * 100)} className="mt-1 gap-0">
        <span className="sr-only">Avance del cronómetro</span>
      </Progress>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>3★ {formatClock(t3)}</span>
        <span>2★ {formatClock(t2)}</span>
        <span>1★ {formatClock(t1)}</span>
      </div>
    </div>
  );
}

export function StarRow({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-0.5", className)} aria-label={`${count} estrellas`}>
      {[1, 2, 3].map((n) => (
        <Star
          key={n}
          className={cn(
            "size-4",
            n <= count
              ? "fill-amber-500 text-amber-500"
              : "text-border",
          )}
        />
      ))}
    </div>
  );
}

export function useElapsed(running: boolean, resetKey: string): number {
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
    if (!running) return;
    const id = window.setInterval(() => {
      setElapsed((Date.now() - startedAt.current) / 1000);
    }, 250);
    return () => window.clearInterval(id);
  }, [running, resetKey]);

  return elapsed;
}
