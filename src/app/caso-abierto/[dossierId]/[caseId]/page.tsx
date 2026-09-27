import { OpenCasePlay } from "@/components/open-case/open-case-play";

export default async function OpenCasePlayPage({
  params,
}: {
  params: Promise<{ dossierId: string; caseId: string }>;
}) {
  const { dossierId, caseId } = await params;
  return (
    <OpenCasePlay dossierId={Number(dossierId)} caseId={Number(caseId)} />
  );
}
