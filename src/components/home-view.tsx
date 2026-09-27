"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { AnimalMark } from "@/components/animal-mark";
import { Button } from "@/components/ui/button";
import { SUSPECTS } from "@/lib/game";
import { RulesDialog } from "@/components/rules-dialog";

export function HomeView() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-10">
        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Expediente de patio
            </p>
            <h1 className="font-heading mt-2 text-5xl leading-[1.05] tracking-tight md:text-6xl">
              Ha sido un carnívoro
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/85">
              Siete animales en corro. Cada uno suelta una frase. Algunas son
              mentira. El dosier te dice cuántos mintieron y cuántos lo
              hicieron. Solo hay una lectura que encaja — y el reloj cuenta.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button nativeButton={false} render={<Link href="/tutorial" />} size="lg">
                Tutorial
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/caso-abierto" />}
                variant="outline"
                size="lg"
              >
                Caso abierto
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/campana" />}
                variant="secondary"
                size="lg"
              >
                Campaña
              </Button>
              <RulesDialog>
                <Button variant="ghost" size="lg">
                  Cómo se investiga
                </Button>
              </RulesDialog>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="blotter absolute inset-[12%] rounded-full" />
            {SUSPECTS.map((s, i) => {
              const angle = (i / SUSPECTS.length) * Math.PI * 2 - Math.PI / 2;
              const left = 50 + Math.cos(angle) * 38;
              const top = 50 + Math.sin(angle) * 38;
              return (
                <div
                  key={s.id}
                  className="paper-card absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl p-2"
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  <AnimalMark suspect={s} size={56} />
                  <span className="text-xs font-medium">{s.name}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="paper-card rounded-2xl p-5">
            <h2 className="font-heading text-2xl">Caso abierto</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Eliges dosier y número de expediente. Doce dificultades, veinte
              casos cada una. Las mejores estrellas quedan en el archivo local.
            </p>
          </article>
          <article className="paper-card rounded-2xl p-5">
            <h2 className="font-heading text-2xl">Campaña</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ocho dosieres en fila. Dos insignias para un fallo. Al cierre, un
              rango: de Aspirante a Inspector.
            </p>
          </article>
          <article className="paper-card rounded-2xl p-5">
            <h2 className="font-heading text-2xl">Solución única</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              El fallo clásico de mesa es montar mal las cartas. Aquí el motor
              enumera asignaciones y solo sirve el caso si hay exactamente una.
            </p>
          </article>
        </section>

        <p className="text-xs text-muted-foreground">
          Inspirado en las reglas y el tipo de puzzle de <em>A Carnivore Did
          It!</em> (Horrible Guild). Sospechosos, frases, casos y marca son
          originales. No es un producto oficial.
        </p>
      </main>
    </div>
  );
}
