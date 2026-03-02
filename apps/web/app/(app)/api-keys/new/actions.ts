"use server";

import { apiBaseUrl } from "@/lib/api";
import { cookies } from "next/headers";

export async function createApiKeyAction(formData: FormData) {
  const token = cookies().get("portal_token")?.value;

  const body = {
    apiId: String(formData.get("apiId") ?? ""),
    name: String(formData.get("name") ?? ""),
    limitPerMinute: Number(formData.get("limitPerMinute") ?? 60),
    limitPerMonth: Number(formData.get("limitPerMonth") ?? 100000)
  };

  const res = await fetch(`${apiBaseUrl()}/api-keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.message ?? "Failed to create API key");
  }

  const payload = await res.json();
  return payload; // includes secret (shown once)
}
