"use client";

import Link from "next/link";
import { AnimalMark } from "@/components/animal-mark";
import { StarRow } from "@/components/investigation/timer-panel";
import { Button } from "@/components/ui/button";
import { dietLabel, lyingIdsOf, guiltyIdsOf, type Assignment, type Suspect } from "@/lib/game";
import type { ReactNode } from "react";

export function ResultPanel({
  correct,
  stars,
  elapsedLabel,
  suspects,
  solution,
  accused,
  children,
}: {
  correct: boolean;
  stars: number;
  elapsedLabel: string;
  suspects: Suspect[];
  solution: Assignment;
  accused: string[];
  children?: ReactNode;
}) {
  const guilty = guiltyIdsOf(solution);
  const liars = lyingIdsOf(solution);
  const accusedSet = new Set(accused);

  return (
    <div className="paper-card rounded-2xl p-5">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        Veredicto
      </p>
      <h2 className="font-heading text-3xl">
        {correct ? "La ronda encaja" : "No era esa lectura"}
      </h2>
      <div className="mt-2 flex items-center gap-3">
        <StarRow count={stars} />
        <span className="text-sm text-muted-foreground">{elapsedLabel}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed">
        {correct
          ? stars === 0
            ? "La acusación es correcta, pero el cronómetro ya no daba estrellas."
            : "Una sola asignación satisfacía el dosier. La has encontrado."
          : "La acusación no coincide con los culpables del expediente."}
      </p>
      <div className="mt-4 grid gap-2">
        {suspects.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-3 rounded-xl border border-border/70 px-3 py-2"
          >
            <AnimalMark suspect={s} size={40} />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{s.name}</p>
              <p className="text-xs text-muted-foreground">
                {s.heightCm} cm · {dietLabel(s.diet)}
              </p>
            </div>
            <div className="flex flex-col items-end text-xs">
              <span className={guilty.includes(s.id) ? "text-primary font-medium" : ""}>
                {guilty.includes(s.id) ? "Culpable" : "Inocente"}
              </span>
              <span className="text-muted-foreground">
                {liars.includes(s.id) ? "Mentía" : "Decía la verdad"}
              </span>
              {accusedSet.has(s.id) && (
                <span className="text-[10px] uppercase tracking-wider text-amber-800">
                  Lo señalaste
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  href,
  action,
}: {
  title: string;
  body: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="paper-card mx-auto max-w-lg rounded-2xl p-8 text-center">
      <h2 className="font-heading text-2xl">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      {href && action && (
        <Button nativeButton={false} render={<Link href={href} />} className="mt-5">
          {action}
        </Button>
      )}
    </div>
  );
}

export function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-12">
      <div className="size-10 animate-pulse rounded-full bg-primary/30" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="paper-card mx-auto max-w-lg rounded-2xl p-8 text-center">
      <h2 className="font-heading text-2xl">El expediente no abre</h2>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button className="mt-5" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
