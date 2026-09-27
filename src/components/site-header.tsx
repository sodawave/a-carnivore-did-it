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
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border/70 bg-card/70 px-3 py-1 backdrop-blur-sm">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
          <PawPrint className="size-3.5" />
        </span>
        <span className="leading-tight">
          <span className="font-heading block text-sm tracking-tight">
            Ha sido un carnívoro
          </span>
          {!compact && (
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Expediente de patio
            </span>
          )}
        </span>
      </Link>
      <nav className="flex items-center gap-0.5">
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
                "rounded-full px-2 py-0.5 text-[13px] transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-secondary",
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <RulesDialog className="ml-1">
          <BookOpen className="size-3.5" />
          Reglas
        </RulesDialog>
      </nav>
    </header>
  );
}

export function DesktopHint() {
  return (
    <p className="shrink-0 bg-primary/10 px-4 py-1.5 text-center text-[11px] text-primary lg:hidden">
      La mesa de investigación está pensada para escritorio. En pantallas
      estrechas el corro se apila bajo el cuaderno.
    </p>
  );
}
