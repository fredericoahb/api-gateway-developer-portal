import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui";

export default async function ApiDetailPage({ params }: { params: { id: string } }) {
  const api = await apiFetch(`/apis/${params.id}`);

  return (
    <div className="space-y-4">
      <Card title={`API: ${api.name} (${api.version})`} right={<Link href="/apis" className="text-sm">Back</Link>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><span className="text-zinc-600">ID:</span> <span className="font-mono">{api.id}</span></div>
          <div><span className="text-zinc-600">Env:</span> {api.environment}</div>
          <div className="md:col-span-2"><span className="text-zinc-600">Base URL:</span> <span className="font-mono">{api.baseUrl}</span></div>
          <div><span className="text-zinc-600">Status:</span> {api.status}</div>
          <div><span className="text-zinc-600">Owner:</span> {api.ownerTeam}</div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link className="rounded-xl border px-4 py-2 bg-white" href={`/ai/docs?apiId=${api.id}`}>Generate Docs with AI</Link>
          <Link className="rounded-xl border px-4 py-2 bg-white" href={`/ai/rca?apiId=${api.id}`}>Generate RCA</Link>
        </div>
      </Card>
    </div>
  );
}
