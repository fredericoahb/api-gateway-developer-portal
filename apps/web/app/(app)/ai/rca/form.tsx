"use client";

import { useState } from "react";
import { generateRcaAction } from "./actions";

function isoHoursAgo(hours: number) {
  const d = new Date(Date.now() - hours * 60 * 60 * 1000);
  return d.toISOString();
}

export function RcaForm({ apis, defaultApiId }: { apis: any[]; defaultApiId?: string }) {
  const [out, setOut] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    setOut(null);
    try {
      const payload = await generateRcaAction(formData);
      setOut(payload);
    } catch (e: any) {
      setError(e.message ?? "Error");
    }
  }

  return (
    <div className="space-y-4 text-sm">
      <form action={onSubmit} className="space-y-3">
        <div>
          <label className="font-medium">API</label>
          <select name="apiId" className="mt-1 w-full rounded-xl border px-3 py-2" defaultValue={defaultApiId ?? apis?.[0]?.id}>
            {apis.map((a) => (
              <option key={a.id} value={a.id}>{a.name} ({a.environment})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="font-medium">rangeStart (ISO)</label>
            <input name="rangeStart" className="mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs" defaultValue={isoHoursAgo(24)} required />
          </div>
          <div>
            <label className="font-medium">rangeEnd (ISO)</label>
            <input name="rangeEnd" className="mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs" defaultValue={new Date().toISOString()} required />
          </div>
        </div>

        <button className="rounded-xl bg-zinc-900 text-white px-4 py-2">Generate RCA</button>
      </form>

      {error && <div className="text-red-700">{error}</div>}

      {out && (
        <div className="rounded-2xl border bg-white p-4">
          <div className="flex justify-between items-center">
            <div className="font-semibold">Result</div>
            <div className="text-xs text-zinc-600">Severity: <span className="font-mono">{out.severity}</span></div>
          </div>
          <pre className="mt-3 whitespace-pre-wrap text-xs">{out.content}</pre>
        </div>
      )}
    </div>
  );
}
