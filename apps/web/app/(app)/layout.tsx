import { TopNav } from "@/components/ui";
import { logoutAction } from "../login/actions";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TopNav />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <form action={logoutAction} className="flex justify-end mb-4">
          <button className="text-sm rounded-xl border px-3 py-1.5 bg-white hover:bg-zinc-50">Logout</button>
        </form>
        {children}
      </div>
    </div>
  );
}
