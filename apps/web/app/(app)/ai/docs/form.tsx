"use client";

import { useMemo, useState } from "react";
import { generateDocsAction } from "./actions";

export function DocsForm({ apis, defaultApiId }: { apis: any[]; defaultApiId?: string }) {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const defaultOpenApi = useMemo(() => JSON.stringify({
    openapi: "3.0.0",
    info: { title: "Example", version: "1.0.0" },
    paths: { "/health": { get: { responses: { "200": { description: "OK" } } } } }
  }, null, 2), []);

  async function onSubmit(formData: FormData) {
    setError(null);
    setMarkdown(null);
    try {
      const out = await generateDocsAction(formData);
      setMarkdown(out.markdown);
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

        <div>
          <label className="font-medium">Context (optional)</label>
          <input name="context" className="mt-1 w-full rounded-xl border px-3 py-2" placeholder="Domain notes, auth details, etc." />
        </div>

        <div>
          <label className="font-medium">OpenAPI JSON</label>
          <textarea name="openApi" className="mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs h-48" defaultValue={defaultOpenApi} />
        </div>

        <button className="rounded-xl bg-zinc-900 text-white px-4 py-2">Generate</button>
      </form>

      {error && <div className="text-red-700">{error}</div>}

      {markdown && (
        <div className="rounded-2xl border bg-white p-4">
          <div className="font-semibold mb-2">Generated Markdown</div>
          <pre className="whitespace-pre-wrap text-xs">{markdown}</pre>
        </div>
      )}
    </div>
  );
}
