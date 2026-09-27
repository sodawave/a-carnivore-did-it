"use client";

import Link from "next/link";
import { SiteHeader, DesktopHint } from "@/components/site-header";
import { InvestigationTable } from "@/components/investigation/investigation-table";
import { Button } from "@/components/ui/button";
import { TUTORIAL_DOSSIER, TUTORIAL_STEPS, tutorialCase, byId } from "@/lib/game";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function TutorialView() {
  const game = tutorialCase();
  const suspects = game.suspectIds.map(byId);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader compact />
      <DesktopHint />
      <InvestigationTable
        dossier={TUTORIAL_DOSSIER}
        game={game}
        suspects={suspects}
        hint={
          <ol className="paper-card space-y-2 rounded-xl p-3">
            {TUTORIAL_STEPS.map((step, i) => (
              <li key={step.title} className="text-sm">
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Paso {i + 1}
                </p>
                <p className="font-medium">{step.title}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
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
      <div className="px-6 pb-6">
        <Alert>
          <AlertTitle>El pavo real no vive aquí</AlertTitle>
          <AlertDescription>
            El tutorial enseña el mismo tipo de razonamiento que el reglamento
            de mesa, con el Lince, el Cisne y el Toro. El culpable es el Cisne.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
