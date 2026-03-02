import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui";
import { RcaForm } from "./form";

export default async function AiRcaPage({ searchParams }: { searchParams: { apiId?: string } }) {
  const apis = await apiFetch("/apis");
  return (
    <Card title="Generate RCA / Insights">
      <RcaForm apis={apis} defaultApiId={searchParams.apiId} />
    </Card>
  );
}
