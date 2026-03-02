"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export function ErrorsByStatusChart(props: { data: { statusCode: number; count: number }[] }) {
  const data = props.data.map((d) => ({ status: String(d.statusCode), count: d.count }));
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LatencyChart(props: { avgLatencyMs: number }) {
  // Minimal placeholder sparkline-like chart
  const data = Array.from({ length: 7 }).map((_, i) => ({ day: `D-${6 - i}`, latency: props.avgLatencyMs }));
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="latency" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
