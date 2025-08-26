import AnalysisDetail from "@/components/partials/analysisDetail";

export default async function DetailAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="w-full pr-[10px]">
      <AnalysisDetail id={id} />
    </div>
  );
}
