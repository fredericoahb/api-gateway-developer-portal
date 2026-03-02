import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { InsightSeverity } from "@prisma/client";

type GeminiResult = { text: string };

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  private client() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new BadRequestException("GEMINI_API_KEY is not configured");
    return new GoogleGenerativeAI(key);
  }

  private async generate(model: string, prompt: string): Promise<GeminiResult> {
    const genAI = this.client();
    const m = genAI.getGenerativeModel({ model });
    const result = await m.generateContent(prompt);
    const text = result.response.text();
    return { text };
  }

  async generateDocs(apiId: string, openApi: Record<string, any>, context?: string) {
    const api = await this.prisma.api.findUnique({ where: { id: apiId } });
    if (!api) throw new BadRequestException("API not found");

    const prompt = [
      "You are a senior API technical writer.",
      "Generate friendly Markdown documentation in Portuguese with:",
      "- Overview",
      "- Authentication",
      "- Base URL and environments",
      "- Key endpoints with examples (curl)",
      "- Common errors and troubleshooting",
      "- Integration checklist",
      "",
      "Keep it structured with headings and bullet points.",
      "Use the provided OpenAPI as source of truth.",
      "",
      `API context: ${context ?? "(none)"}`,
      "",
      "OpenAPI JSON:",
      JSON.stringify(openApi).slice(0, 120000) // hard cap to avoid extreme prompts
    ].join("\n");

    const out = await this.generate("gemini-1.5-flash", prompt);

    const saved = await this.prisma.aiGeneratedDoc.create({
      data: { apiId, markdown: out.text }
    });

    return saved;
  }

  async generateInsights(apiId: string, rangeStart: Date, rangeEnd: Date) {
    const api = await this.prisma.api.findUnique({ where: { id: apiId } });
    if (!api) throw new BadRequestException("API not found");

    const logs = await this.prisma.requestLog.findMany({
      where: { apiId, timestamp: { gte: rangeStart, lte: rangeEnd } },
      select: { statusCode: true, latencyMs: true, path: true, method: true, timestamp: true },
      orderBy: { timestamp: "asc" }
    });

    if (logs.length === 0) throw new BadRequestException("No logs in the selected range");

    const total = logs.length;
    const errors = logs.filter((l) => l.statusCode >= 400).length;
    const avgLatency = Math.round(logs.reduce((a, b) => a + b.latencyMs, 0) / total);

    const statusDist: Record<string, number> = {};
    for (const l of logs) statusDist[String(l.statusCode)] = (statusDist[String(l.statusCode)] ?? 0) + 1;

    const topPaths: Record<string, number> = {};
    for (const l of logs) {
      const key = `${l.method} ${l.path}`.slice(0, 120);
      topPaths[key] = (topPaths[key] ?? 0) + 1;
    }

    const topPathsArr = Object.entries(topPaths)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([k, v]) => ({ route: k, count: v }));

    const prompt = [
      "You are an experienced SRE and API platform engineer.",
      "Perform an RCA-style analysis for the provided metrics/log summary.",
      "Return Markdown in Portuguese with:",
      "1) Summary of what happened",
      "2) Evidence (metrics)",
      "3) Hypotheses for root cause (ranked)",
      "4) Recommended corrective actions (short-term / long-term)",
      "5) Severity classification: LOW, MEDIUM, HIGH, CRITICAL",
      "",
      "Be pragmatic and do not hallucinate details. Base the analysis on the numbers.",
      "",
      `API: ${api.name} ${api.version} (${api.environment})`,
      `Range: ${rangeStart.toISOString()} -> ${rangeEnd.toISOString()}`,
      `Total requests: ${total}`,
      `Errors (>=400): ${errors}`,
      `Avg latency (ms): ${avgLatency}`,
      `Status distribution: ${JSON.stringify(statusDist)}`,
      `Top routes: ${JSON.stringify(topPathsArr)}`
    ].join("\n");

    const out = await this.generate("gemini-1.5-flash", prompt);

    const severity = this.extractSeverity(out.text);

    const saved = await this.prisma.aiInsight.create({
      data: {
        apiId,
        rangeStart,
        rangeEnd,
        content: out.text,
        severity
      }
    });

    return saved;
  }

  private extractSeverity(text: string): InsightSeverity {
    const t = text.toUpperCase();
    if (t.includes("CRITICAL")) return InsightSeverity.CRITICAL;
    if (t.includes("HIGH")) return InsightSeverity.HIGH;
    if (t.includes("MEDIUM")) return InsightSeverity.MEDIUM;
    return InsightSeverity.LOW;
  }
}
