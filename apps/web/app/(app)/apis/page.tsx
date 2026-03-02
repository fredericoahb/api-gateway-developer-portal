import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui";

export default async function ApisPage() {
  const apis = await apiFetch("/apis");

  return (
    <Card
      title="APIs"
      right={<Link className="text-sm rounded-xl border px-3 py-1.5 bg-white hover:bg-zinc-50" href="/apis/new">New</Link>}
    >
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-zinc-600">
            <tr>
              <th className="py-2">Name</th>
              <th>Version</th>
              <th>Env</th>
              <th>Status</th>
              <th>Owner</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {apis.map((a: any) => (
              <tr key={a.id} className="border-t">
                <td className="py-2 font-medium">{a.name}</td>
                <td>{a.version}</td>
                <td>{a.environment}</td>
                <td>{a.status}</td>
                <td>{a.ownerTeam}</td>
                <td className="text-right">
                  <Link href={`/apis/${a.id}`} className="text-sm">Manage</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
