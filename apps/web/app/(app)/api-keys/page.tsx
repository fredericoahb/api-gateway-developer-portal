import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui";

export default async function ApiKeysPage() {
  const keys = await apiFetch("/api-keys");

  return (
    <Card
      title="API Keys"
      right={<Link className="text-sm rounded-xl border px-3 py-1.5 bg-white hover:bg-zinc-50" href="/api-keys/new">New</Link>}
    >
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-zinc-600">
            <tr>
              <th className="py-2">Name</th>
              <th>API</th>
              <th>Prefix</th>
              <th>Limits</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k: any) => (
              <tr key={k.id} className="border-t">
                <td className="py-2 font-medium">{k.name}</td>
                <td>{k.api?.name} ({k.api?.environment})</td>
                <td className="font-mono">{k.keyPrefix}…</td>
                <td>{k.limitPerMinute}/min • {k.limitPerMonth}/month</td>
                <td>{k.revokedAt ? "REVOKED" : "ACTIVE"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
