import { Card } from "@/components/ui";
import { createApiAction } from "./actions";

export default function NewApiPage() {
  return (
    <Card title="Create API">
      <form action={createApiAction} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div>
          <label className="font-medium">Name</label>
          <input name="name" className="mt-1 w-full rounded-xl border px-3 py-2" required />
        </div>
        <div>
          <label className="font-medium">Version</label>
          <input name="version" className="mt-1 w-full rounded-xl border px-3 py-2" placeholder="1.0.0" required />
        </div>
        <div className="md:col-span-2">
          <label className="font-medium">Base URL</label>
          <input name="baseUrl" className="mt-1 w-full rounded-xl border px-3 py-2" placeholder="https://api.example.com" required />
        </div>
        <div>
          <label className="font-medium">Environment</label>
          <select name="environment" className="mt-1 w-full rounded-xl border px-3 py-2">
            <option>DEV</option>
            <option>HML</option>
            <option>PRD</option>
          </select>
        </div>
        <div>
          <label className="font-medium">Status</label>
          <select name="status" className="mt-1 w-full rounded-xl border px-3 py-2">
            <option>ACTIVE</option>
            <option>INACTIVE</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="font-medium">Owner Team</label>
          <input name="ownerTeam" className="mt-1 w-full rounded-xl border px-3 py-2" required />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button className="rounded-xl bg-zinc-900 text-white px-4 py-2">Create</button>
          <a href="/apis" className="rounded-xl border px-4 py-2 bg-white">Cancel</a>
        </div>
      </form>
    </Card>
  );
}
