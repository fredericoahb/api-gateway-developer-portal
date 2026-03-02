import { Card } from "@/components/ui";
import Link from "next/link";

export default function AiHome() {
  return (
    <Card title="AI">
      <div className="text-sm text-zinc-700">
        Use the AI features from an API detail page, or open:
      </div>
      <ul className="mt-3 text-sm list-disc pl-5 space-y-1">
        <li><Link href="/ai/docs">Generate Docs with AI</Link></li>
        <li><Link href="/ai/rca">Generate RCA</Link></li>
      </ul>
    </Card>
  );
}
