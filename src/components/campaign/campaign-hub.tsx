"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteHeader, DesktopHint } from "@/components/site-header";
import { InvestigationTable, type ResolvePayload } from "@/components/investigation/investigation-table";
import {
  EmptyState,
  ErrorState,
} from "@/components/investigation/result-panel";
import { StarRow } from "@/components/investigation/timer-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CAMPAIGN_DOSSIER_IDS,
  RANKS,
  caseSeed,
  dossierById,
  generateCase,
  honestyLabel,
  suspectsForCount,
} from "@/lib/game";
import {
  campaignTotals,
  currentCampaignDossierId,
  failCampaign,
  loadProgress,
  recordCampaignCase,
  resetCampaign,
  spendBadgeAndSkip,
  startCampaign,
  useProgress,
} from "@/lib/persist";

export function CampaignHub() {
  const progress = useProgress();
  const router = useRouter();
  const { campaign } = progress;
  const totals = campaignTotals(campaign);

  function begin() {
    startCampaign();
    router.push("/campana/partida");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Campaña
        </p>
        <h1 className="font-heading text-4xl">Ocho expedientes seguidos</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Un caso por dosier, del 01 al 08. Dos insignias para saltar un fallo.
          Cada insignia gastada resta una estrella al rango final.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Badge variant="outline">Insignias: {campaign.badgesLeft}/2</Badge>
          <Badge variant="outline">Gastadas: {campaign.badgesUsed}</Badge>
          {campaign.status !== "idle" && (
            <Badge>
              {totals.rank.label} · {totals.score} pts
            </Badge>
          )}
        </div>

        {campaign.status === "idle" && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Sin campaña abierta</CardTitle>
              <CardDescription>
                Empiezas en el dosier 01. No se puede saltar hacia delante ni
                volver atrás.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={begin}>Empezar campaña</Button>
            </CardContent>
          </Card>
        )}

        {campaign.status === "in_progress" && (
          <div className="mt-8 flex flex-wrap gap-2">
            <Button nativeButton={false} render={<Link href="/campana/partida" />}>
              Continuar dosier{" "}
              {String(currentCampaignDossierId(campaign)).padStart(2, "0")}
            </Button>
            <Button variant="outline" onClick={() => resetCampaign()}>
              Abandonar y reiniciar
            </Button>
          </div>
        )}

        {(campaign.status === "completed" || campaign.status === "failed") && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">
                {campaign.status === "completed"
                  ? "Campaña cerrada"
                  : "Campaña rota"}
              </CardTitle>
              <CardDescription>
                {campaign.status === "failed"
                  ? "Sin insignias y un fallo: se acaba el ascenso."
                  : "Ocho dosieres recorridos. Este es tu rango."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-heading text-3xl">{totals.rank.label}</p>
              <p className="text-sm text-muted-foreground">
                {totals.stars} estrellas brutas − {campaign.badgesUsed} insignias
                = {totals.score} puntos.
              </p>
              <Button onClick={begin}>Nueva campaña</Button>
            </CardContent>
          </Card>
        )}

        <ol className="mt-8 grid gap-2">
          {CAMPAIGN_DOSSIER_IDS.map((id, index) => {
            const d = dossierById(id);
            const result = campaign.results.find((r) => r.dossierId === id);
            const current =
              campaign.status === "in_progress" && campaign.nextIndex === index;
            return (
              <li
                key={id}
                className="flex items-center justify-between rounded-xl border bg-card/70 px-4 py-3"
              >
                <div>
                  <p className="text-xs text-muted-foreground">
                    Dosier {String(id).padStart(2, "0")}
                    {current ? " · en curso" : ""}
                  </p>
                  <p className="font-medium">{d.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.suspectCount} sospechosos · {honestyLabel(d)}
                  </p>
                </div>
                {result ? (
                  result.skipped ? (
                    <span className="text-xs text-muted-foreground">Insignia</span>
                  ) : (
                    <StarRow count={result.stars} />
                  )
                ) : (
                  <span className="text-xs text-muted-foreground">Pendiente</span>
                )}
              </li>
            );
          })}
        </ol>

        <section className="mt-10">
          <h2 className="font-heading text-2xl">Rangos de detective</h2>
          <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
            {[...RANKS].reverse().map((r) => (
              <li key={r.id} className="flex justify-between rounded-lg border px-3 py-2">
                <span>{r.label}</span>
                <span className="text-muted-foreground">
                  {r.minScore === 0 ? "menos de 7" : `${r.minScore}+`}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export function CampaignPlay() {
  const progress = useProgress();
  const liveId = currentCampaignDossierId(progress.campaign);
  const [pinnedId, setPinnedId] = useState<number | null>(null);
  const [nonce, setNonce] = useState(0);
  const router = useRouter();
  const playingId = pinnedId ?? liveId;
  const dossier = playingId ? dossierById(playingId) : null;

  const built = useMemo(() => {
    if (!dossier || !playingId) return null;
    try {
      return {
        game: generateCase(
          dossier,
          `${caseSeed("campaign", playingId, 1)}:${nonce}`,
        ),
        error: null as string | null,
      };
    } catch (err) {
      return {
        game: null,
        error: err instanceof Error ? err.message : "No se pudo generar el caso.",
      };
    }
  }, [dossier, playingId, nonce]);

  if (!dossier || !playingId) {
    return (
      <div className="flex min-h-full flex-1 flex-col">
        <SiteHeader />
        <div className="flex flex-1 items-center p-8">
          <EmptyState
            title="No hay partida en curso"
            body="Empieza una campaña desde el tablero o retoma una que hayas dejado a medias."
            href="/campana"
            action="Ir a campaña"
          />
        </div>
      </div>
    );
  }

  if (!built || built.error || !built.game) {
    return (
      <div className="flex min-h-full flex-1 flex-col">
        <SiteHeader compact />
        <ErrorState
          message={built?.error ?? "Caso vacío"}
          onRetry={() => setNonce((n) => n + 1)}
        />
      </div>
    );
  }

  function after(payload: ResolvePayload) {
    if (!playingId) return;
    if (payload.stars > 0) {
      setPinnedId(playingId);
      recordCampaignCase(playingId, payload.stars, payload.elapsedSec, false);
      return;
    }
  }

  function advanceBoard() {
    setPinnedId(null);
    const nextId = currentCampaignDossierId(loadProgress().campaign);
    if (!nextId) router.push("/campana");
  }

  function useBadge() {
    if (!playingId) return;
    const next = spendBadgeAndSkip(playingId);
    setPinnedId(null);
    if (next.campaign.status === "completed") {
      router.push("/campana");
    }
  }

  function giveUp() {
    failCampaign();
    router.push("/campana");
  }

  const campaignDone = progress.campaign.status === "completed";

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader compact />
      <DesktopHint />
      <InvestigationTable
        key={`${playingId}-${nonce}`}
        dossier={dossier}
        game={built.game}
        suspects={suspectsForCount(dossier.suspectCount)}
        banner={
          <p className="bg-secondary/60 px-4 py-2 text-center text-xs">
            Campaña · dosier {String(playingId).padStart(2, "0")} de 08 ·
            insignias {progress.campaign.badgesLeft}/2
          </p>
        }
        onResolved={after}
        resultActions={(payload) => {
          if (payload.stars > 0) {
            if (campaignDone) {
              return (
                <Button nativeButton={false} render={<Link href="/campana" />}>
                  Ver rango
                </Button>
              );
            }
            return <Button onClick={advanceBoard}>Siguiente dosier</Button>;
          }
          if (progress.campaign.badgesLeft > 0) {
            return (
              <>
                <Button onClick={useBadge}>Gastar insignia y seguir</Button>
                <Button variant="outline" onClick={giveUp}>
                  Cerrar campaña
                </Button>
              </>
            );
          }
          return (
            <Button onClick={giveUp}>Sin insignias · cerrar campaña</Button>
          );
        }}
      />
    </div>
  );
}
