import { cookies } from "next/headers";

export function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/v1";
}

export async function apiFetch(path: string, init?: RequestInit) {
  const token = cookies().get("portal_token")?.value;

  const res = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    cache: "no-store"
  });

  if (!res.ok) {
    let payload: any = null;
    try { payload = await res.json(); } catch {}
    const msg = payload?.message ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return res.json();
}
