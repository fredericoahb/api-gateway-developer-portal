import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui";
import { DocsForm } from "./form";

export default async function AiDocsPage({ searchParams }: { searchParams: { apiId?: string } }) {
  const apis = await apiFetch("/apis");
  return (
    <Card title="Generate Docs with AI">
      <DocsForm apis={apis} defaultApiId={searchParams.apiId} />
    </Card>
  );
}
