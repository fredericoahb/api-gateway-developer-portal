"use server";

import { apiBaseUrl } from "@/lib/api";
import { cookies } from "next/headers";

export async function generateRcaAction(formData: FormData) {
  const token = cookies().get("portal_token")?.value;
  const apiId = String(formData.get("apiId") ?? "");
  const rangeStart = String(formData.get("rangeStart") ?? "");
  const rangeEnd = String(formData.get("rangeEnd") ?? "");

  const res = await fetch(`${apiBaseUrl()}/ai/metrics/insights`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ apiId, rangeStart, rangeEnd }),
    cache: "no-store"
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.message ?? "Failed to generate RCA");
  }

  return res.json();
}
