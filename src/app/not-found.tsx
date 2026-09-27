import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="font-heading text-4xl">Expediente extraviado</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Esa ruta no está en el archivo del patio.
        </p>
        <Button nativeButton={false} render={<Link href="/" />} className="mt-6">
          Volver a la portada
        </Button>
      </main>
    </div>
  );
}
