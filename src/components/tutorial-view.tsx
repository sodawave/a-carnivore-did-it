"use client";

import Link from "next/link";
import { SiteHeader, DesktopHint } from "@/components/site-header";
import { InvestigationTable } from "@/components/investigation/investigation-table";
import { Button } from "@/components/ui/button";
import { TUTORIAL_DOSSIER, TUTORIAL_STEPS, tutorialCase, byId } from "@/lib/game";

export function TutorialView() {
  const game = tutorialCase();
  const suspects = game.suspectIds.map(byId);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SiteHeader compact />
      <DesktopHint />
      <InvestigationTable
        dossier={TUTORIAL_DOSSIER}
        game={game}
        suspects={suspects}
        banner={
          <ol className="grid shrink-0 grid-cols-4 gap-px border-b border-border/70 bg-secondary/50 text-[11px] leading-tight">
            {TUTORIAL_STEPS.map((step, i) => (
              <li key={step.title} className="bg-card/70 px-2.5 py-1.5">
                <span className="font-medium text-foreground">
                  {i + 1}. {step.title}.{" "}
                </span>
                <span className="text-muted-foreground">{step.body}</span>
                {i === TUTORIAL_STEPS.length - 1 ? (
                  <span className="mt-0.5 block text-[10px] text-muted-foreground">
                    Sospechosos propios: el culpable es el Cisne.
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        }
        resultActions={() => (
          <>
            <Button nativeButton={false} render={<Link href="/caso-abierto" />}>
              Caso abierto
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/campana" />}
            >
              Empezar campaña
            </Button>
          </>
        )}
      />
    </div>
  );
}
