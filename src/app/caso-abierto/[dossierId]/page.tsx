import { CasePicker } from "@/components/open-case/dossier-grid";

export default async function DossierPage({
  params,
}: {
  params: Promise<{ dossierId: string }>;
}) {
  const { dossierId } = await params;
  return <CasePicker dossierId={Number(dossierId)} />;
}
