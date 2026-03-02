import Link from "next/link";

export function Card(props: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-zinc-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{props.title}</h2>
        {props.right}
      </div>
      <div>{props.children}</div>
    </div>
  );
}

export function TopNav() {
  return (
    <div className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="font-semibold">api-gateway-developer-portal</Link>
        <div className="flex gap-4 text-sm">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/apis">APIs</Link>
          <Link href="/api-keys">API Keys</Link>
          <Link href="/ai">AI</Link>
        </div>
      </div>
    </div>
  );
}
