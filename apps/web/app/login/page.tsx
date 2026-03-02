import { loginAction } from "./actions";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border bg-white shadow-sm p-6">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="text-sm text-zinc-600 mt-1">Use the seeded admin to start.</p>

        <form action={loginAction} className="mt-6 space-y-3">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input name="email" type="email" className="mt-1 w-full rounded-xl border px-3 py-2" defaultValue="admin@local.dev" required />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input name="password" type="password" className="mt-1 w-full rounded-xl border px-3 py-2" defaultValue="admin12345" required />
          </div>
          <button className="w-full rounded-xl bg-zinc-900 text-white py-2 font-medium hover:bg-zinc-800">
            Login
          </button>
        </form>

        <div className="mt-4 text-xs text-zinc-500">
          Backend Swagger: <a href="http://localhost:3001/v1/docs" target="_blank">/v1/docs</a>
        </div>
      </div>
    </div>
  );
}
