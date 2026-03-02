import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui";
import { ErrorsByStatusChart, LatencyChart } from "@/components/dashboard-charts";

export default async function DashboardPage() {
  const metrics = await apiFetch("/metrics/dashboard");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Requests (7d)">
          <div className="text-3xl font-semibold">{metrics.totalRequests}</div>
          <div className="text-xs text-zinc-500 mt-1">{metrics.rangeStart} → {metrics.rangeEnd}</div>
        </Card>
        <Card title="Avg Latency">
          <div className="text-3xl font-semibold">{metrics.avgLatencyMs} ms</div>
        </Card>
        <Card title="Top APIs">
          <ul className="text-sm space-y-1">
            {metrics.topApis.map((x: any) => (
              <li key={x.apiId} className="flex justify-between">
                <span className="font-mono">{x.apiId}</span>
                <span>{x._count.apiId}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Errors by Status Code">
          <ErrorsByStatusChart data={metrics.errorsByStatus} />
        </Card>
        <Card title="Latency (avg)">
          <LatencyChart avgLatencyMs={metrics.avgLatencyMs} />
        </Card>
      </div>
    </div>
  );
}
