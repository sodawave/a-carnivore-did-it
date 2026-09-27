"use client";

import Link from "next/link";
import { SiteHeader, DesktopHint } from "@/components/site-header";
import { InvestigationTable } from "@/components/investigation/investigation-table";
import { Button } from "@/components/ui/button";
import { TUTORIAL_DOSSIER, tutorialCase, byId } from "@/lib/game";

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
          <p className="shrink-0 border-b border-border/70 bg-secondary/50 px-4 py-1.5 text-sm leading-snug">
            <span className="font-medium">Tutorial.</span>{" "}
            <span className="text-muted-foreground">
              3 sospechosos, 1 culpable, 1 mentira. Si el Cisne dijera la
              verdad, Lince y Toro mentirían. El culpable es el Cisne.
            </span>
          </p>
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
