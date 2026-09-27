"use client";

import { useState } from "react";
import { AnimalMark } from "@/components/animal-mark";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dietLabel, type Dossier, type Suspect } from "@/lib/game";
import { cn } from "@/lib/utils";

export function AccusationDialog({
  open,
  onOpenChange,
  suspects,
  dossier,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suspects: Suspect[];
  dossier: Dossier;
  onConfirm: (accusedIds: string[]) => void;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const need = dossier.culpritCount;
  const ready = picked.length === need;

  function toggle(id: string) {
    setPicked((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= need) return [...prev.slice(1), id];
      return [...prev, id];
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setPicked([]);
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Acusación</DialogTitle>
          <DialogDescription>
            Señala {need === 1 ? "al culpable" : `a los ${need} culpables`}. El
            cuaderno no se envía: solo esta lista.
          </DialogDescription>
        </DialogHeader>
        <ul className="grid grid-cols-1 gap-2">
          {suspects.map((suspect) => {
            const on = picked.includes(suspect.id);
            return (
              <li key={suspect.id}>
                <button
                  type="button"
                  onClick={() => toggle(suspect.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left",
                    on
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-secondary",
                  )}
                >
                  <AnimalMark suspect={suspect} size={44} />
                  <span>
                    <span className="block font-medium">{suspect.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {suspect.heightCm} cm · {dietLabel(suspect.diet)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="text-xs text-muted-foreground">
          {picked.length}/{need} señalados
        </p>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Seguir pensando
          </Button>
          <Button disabled={!ready} onClick={() => onConfirm(picked)}>
            Presentar acusación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
