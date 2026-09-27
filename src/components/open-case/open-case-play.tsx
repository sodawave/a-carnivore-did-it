"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SiteHeader, DesktopHint } from "@/components/site-header";
import {
  ErrorState,
} from "@/components/investigation/result-panel";
import { InvestigationTable, type ResolvePayload } from "@/components/investigation/investigation-table";
import { Button } from "@/components/ui/button";
import {
  caseSeed,
  dossierById,
  generateCase,
  suspectsForCount,
} from "@/lib/game";
import { recordOpenBest } from "@/lib/persist";

export function OpenCasePlay({
  dossierId,
  caseId,
}: {
  dossierId: number;
  caseId: number;
}) {
  const dossier = dossierById(dossierId);
  const [nonce, setNonce] = useState(0);
  const built = useMemo(() => {
    try {
      const game = generateCase(
        dossier,
        `${caseSeed("open", dossierId, caseId)}:${nonce}`,
      );
      return { game, error: null as string | null };
    } catch (err) {
      return {
        game: null,
        error: err instanceof Error ? err.message : "No se pudo generar el caso.",
      };
    }
  }, [dossier, dossierId, caseId, nonce]);

  function persist(payload: ResolvePayload) {
    recordOpenBest(dossierId, caseId, payload.stars, payload.elapsedSec);
  }

  if (built.error || !built.game) {
    return (
      <Shell>
        <ErrorState message={built.error ?? "Caso vacío"} onRetry={() => setNonce((n) => n + 1)} />
      </Shell>
    );
  }

  return (
    <Shell>
      <InvestigationTable
        dossier={dossier}
        game={built.game}
        suspects={suspectsForCount(dossier.suspectCount)}
        onResolved={persist}
        resultActions={() => (
          <>
            <Button
              nativeButton={false}
              render={<Link href={`/caso-abierto/${dossierId}`} />}
            >
              Otros casos del dosier
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/caso-abierto" />}
            >
              Elegir dosier
            </Button>
          </>
        )}
      />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SiteHeader compact />
      <DesktopHint />
      {children}
    </div>
  );
}
