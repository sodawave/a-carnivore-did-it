"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ReactNode } from "react";

export function RulesDialog({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "lg";
}) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" size={size} className={className} />}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Cómo se investiga</DialogTitle>
          <DialogDescription>
            Un problema de lógica con disfraz de interrogatorio. No hay arma, ni
            móvil, ni historia: solo una asignación que encaja.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
          <p>
            Los sospechosos se sientan en corro. Cada uno tiene nombre, altura y
            dieta (carnívoro o herbívoro) y suelta una frase. Esa frase puede ser
            verdad o mentira.
          </p>
          <p>
            El dosier fija cuántos hay en el corro, cuántos son culpables y
            cuántas frases son mentira (o verdad). Culpa y honestidad no se
            excluyen: el culpable puede mentir o decir la verdad.
          </p>
          <p>
            «Un herbívoro lo hizo» es cierto si <em>al menos uno</em> de los
            culpables es herbívoro. «Alguien a mi lado lo hizo» mira a los dos
            vecinos del círculo. «A y B mienten» es falso en cuanto uno de los
            dos dice la verdad. «A o B lo hizo (o ambos)» solo es falso si los
            dos son inocentes.
          </p>
          <p>
            Cada expediente tiene <strong>una sola solución</strong>. El motor no
            sirve casos irresolubles ni con varias lecturas. Marca hipótesis en
            el cuaderno —el de mesa no traía uno— y acusa cuando el corro te
            cuadre. El cronómetro reparte 3, 2 o 1 estrella; fuera de tiempo o
            con el culpable equivocado no hay estrellas.
          </p>
          <p className="text-muted-foreground">
            Inspirado en el tipo de puzzle de <em>A Carnivore Did It!</em>.
            Sospechosos, frases, arte y marca son propios de este expediente.
          </p>
        </div>
        <DialogClose render={<Button className="mt-2 w-full" />}>
          Entendido
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
