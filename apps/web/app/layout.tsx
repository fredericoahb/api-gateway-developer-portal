import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Gateway Developer Portal",
  description: "Mini API Gateway + Developer Portal + AI Insights Engine"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
