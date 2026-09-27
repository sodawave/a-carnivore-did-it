"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { AnimalMark } from "@/components/animal-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/investigation/result-panel";
import { StarRow } from "@/components/investigation/timer-panel";
import {
  DOSSIERS,
  OPEN_CASE_COUNT,
  dietLabel,
  dossierById,
  formatClock,
  honestyLabel,
  suspectsForCount,
} from "@/lib/game";
import { openCaseKey, useProgress } from "@/lib/persist";

export function DossierGrid() {
  const progress = useProgress();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Caso abierto
        </p>
        <h1 className="font-heading text-4xl">Elige un dosier</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Cada dosier fija el corro, los culpables y las mentiras. Luego eliges
          uno de {OPEN_CASE_COUNT} expedientes. El motor solo sirve puzzles con
          una solución.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DOSSIERS.map((d) => {
            const bests = Object.entries(progress.openBest).filter(([k]) =>
              k.startsWith(`${d.id}:`),
            );
            const top = bests.reduce((m, [, v]) => Math.max(m, v.stars), 0);
            const solved = bests.filter(([, v]) => v.stars > 0).length;
            return (
              <li key={d.id}>
                <Card className="h-full">
                  <CardHeader>
                    <Badge variant="outline">
                      Dosier {String(d.id).padStart(2, "0")}
                    </Badge>
                    <CardTitle className="font-heading text-2xl">
                      {d.title}
                    </CardTitle>
                    <CardDescription>{d.blurb}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">
                      {d.suspectCount} sospechosos · {d.culpritCount}{" "}
                      {d.culpritCount === 1 ? "culpable" : "culpables"} ·{" "}
                      {honestyLabel(d)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      3★ {formatClock(d.timers[0])} · 2★ {formatClock(d.timers[1])} · 1★{" "}
                      {formatClock(d.timers[2])}
                    </p>
                    {solved === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        Aún no hay marcas en este dosier.
                      </p>
                    ) : (
                      <div className="flex items-center gap-2 text-xs">
                        <StarRow count={top} />
                        <span>
                          {solved}/{OPEN_CASE_COUNT} con estrellas
                        </span>
                      </div>
                    )}
                    <Button
                      nativeButton={false}
                      render={<Link href={`/caso-abierto/${d.id}`} />}
                      className="w-full"
                    >
                      Abrir dosier
                    </Button>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}

export function CasePicker({ dossierId }: { dossierId: number }) {
  const progress = useProgress();

  if (!Number.isFinite(dossierId) || dossierId < 1 || dossierId > 12) {
    return (
      <div className="flex min-h-full flex-1 flex-col">
        <SiteHeader />
        <div className="flex flex-1 items-center p-8">
          <EmptyState
            title="Dosier inexistente"
            body="Ese número no está en el archivo."
            href="/caso-abierto"
            action="Volver a los dosieres"
          />
        </div>
      </div>
    );
  }

  const dossier = dossierById(dossierId);
  const suspects = suspectsForCount(dossier.suspectCount);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Dosier {String(dossier.id).padStart(2, "0")}
        </p>
        <h1 className="font-heading text-4xl">{dossier.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{dossier.blurb}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {suspects.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2 py-1 text-xs"
            >
              <AnimalMark suspect={s} size={22} />
              {s.name} · {s.heightCm} · {dietLabel(s.diet)}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm">
          {dossier.suspectCount} sospechosos · {dossier.culpritCount}{" "}
          {dossier.culpritCount === 1 ? "culpable" : "culpables"} ·{" "}
          {honestyLabel(dossier)}
        </p>
        <ol className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {Array.from({ length: OPEN_CASE_COUNT }, (_, i) => i + 1).map((n) => {
            const best = progress.openBest[openCaseKey(dossierId, n)];
            return (
              <li key={n}>
                <Link
                  href={`/caso-abierto/${dossierId}/${n}`}
                  className="paper-card flex flex-col items-center rounded-xl px-3 py-4 text-center hover:ring-2 hover:ring-primary/40"
                >
                  <span className="text-xs text-muted-foreground">Caso</span>
                  <span className="font-heading text-2xl">{n}</span>
                  {best ? (
                    <StarRow count={best.stars} className="mt-1" />
                  ) : (
                    <span className="mt-1 text-[11px] text-muted-foreground">
                      Sin marca
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}
