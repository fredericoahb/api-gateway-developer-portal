import { Card } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { ApiKeyCreateForm } from "./form";

export default async function NewApiKeyPage() {
  const apis = await apiFetch("/apis");
  return (
    <Card title="Create API Key">
      <ApiKeyCreateForm apis={apis} />
    </Card>
  );
}
