"use server";

import { apiBaseUrl } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createApiAction(formData: FormData) {
  const token = cookies().get("portal_token")?.value;
  const body = {
    name: String(formData.get("name") ?? ""),
    version: String(formData.get("version") ?? ""),
    baseUrl: String(formData.get("baseUrl") ?? ""),
    environment: String(formData.get("environment") ?? "DEV"),
    status: String(formData.get("status") ?? "ACTIVE"),
    ownerTeam: String(formData.get("ownerTeam") ?? "")
  };

  const res = await fetch(`${apiBaseUrl()}/apis`, {
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
    throw new Error(payload?.message ?? "Failed to create API");
  }

  redirect("/apis");
}
