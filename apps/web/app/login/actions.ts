"use server";

import { cookies } from "next/headers";
import { apiBaseUrl } from "@/lib/api";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const res = await fetch(`${apiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store"
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.message ?? "Login failed");
  }

  const payload = await res.json();
  const token = payload.accessToken as string;

  cookies().set("portal_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });

  return { ok: true };
}

export async function logoutAction() {
  cookies().delete("portal_token");
}
