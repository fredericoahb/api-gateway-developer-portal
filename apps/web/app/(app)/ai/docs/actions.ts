"use server";

import { apiBaseUrl } from "@/lib/api";
import { cookies } from "next/headers";

export async function generateDocsAction(formData: FormData) {
  const token = cookies().get("portal_token")?.value;
  const apiId = String(formData.get("apiId") ?? "");
  const context = String(formData.get("context") ?? "");
  const openApiText = String(formData.get("openApi") ?? "");

  const openApi = JSON.parse(openApiText);

  const res = await fetch(`${apiBaseUrl()}/ai/apis/${apiId}/docs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ openApi, context }),
    cache: "no-store"
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.message ?? "Failed to generate docs");
  }

  return res.json();
}
