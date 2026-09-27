"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, PawPrint } from "lucide-react";
import { RulesDialog } from "@/components/rules-dialog";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Portada" },
  { href: "/tutorial", label: "Tutorial" },
  { href: "/caso-abierto", label: "Caso abierto" },
  { href: "/campana", label: "Campaña" },
];

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border/70 bg-card/70 px-5 py-3 backdrop-blur-sm">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
          <PawPrint className="size-4" />
        </span>
        <span className="leading-tight">
          <span className="font-heading block text-lg tracking-tight">
            Ha sido un carnívoro
          </span>
          {!compact && (
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Expediente de patio
            </span>
          )}
        </span>
      </Link>
      <nav className="flex items-center gap-1">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-secondary",
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <RulesDialog>
          <button
            type="button"
            className="ml-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-foreground/80 hover:bg-secondary"
          >
            <BookOpen className="size-3.5" />
            Reglas
          </button>
        </RulesDialog>
      </nav>
    </header>
  );
}

export function DesktopHint() {
  return (
    <p className="bg-primary/10 px-4 py-2 text-center text-xs text-primary xl:hidden">
      La mesa de investigación está pensada para escritorio. En pantallas
      estrechas el corro se apila bajo el cuaderno.
    </p>
  );
}
