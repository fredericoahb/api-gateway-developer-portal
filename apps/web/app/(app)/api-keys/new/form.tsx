"use client";

import { useState } from "react";
import { createApiKeyAction } from "./actions";

export function ApiKeyCreateForm({ apis }: { apis: any[] }) {
  const [secret, setSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    try {
      const payload = await createApiKeyAction(formData);
      setSecret(payload.secret);
    } catch (e: any) {
      setError(e.message ?? "Error");
    }
  }

  return (
    <div className="space-y-4 text-sm">
      <form action={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <label className="font-medium">API</label>
          <select name="apiId" className="mt-1 w-full rounded-xl border px-3 py-2">
            {apis.map((a) => (
              <option key={a.id} value={a.id}>{a.name} ({a.environment})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium">Name</label>
          <input name="name" className="mt-1 w-full rounded-xl border px-3 py-2" required />
        </div>

        <div>
          <label className="font-medium">Limit / minute</label>
          <input name="limitPerMinute" type="number" className="mt-1 w-full rounded-xl border px-3 py-2" defaultValue={60} min={1} required />
        </div>

        <div>
          <label className="font-medium">Limit / month</label>
          <input name="limitPerMonth" type="number" className="mt-1 w-full rounded-xl border px-3 py-2" defaultValue={100000} min={1} required />
        </div>

        <div className="md:col-span-2 flex gap-2">
          <button className="rounded-xl bg-zinc-900 text-white px-4 py-2">Create</button>
          <a href="/api-keys" className="rounded-xl border px-4 py-2 bg-white">Back</a>
        </div>
      </form>

      {error && <div className="text-red-700">{error}</div>}

      {secret && (
        <div className="rounded-2xl border bg-zinc-50 p-4">
          <div className="font-semibold">API Key Secret (shown only once)</div>
          <div className="mt-2 font-mono break-all">{secret}</div>
          <div className="mt-2 text-xs text-zinc-600">
            Store this securely. It will not be shown again.
          </div>
        </div>
      )}
    </div>
  );
}
