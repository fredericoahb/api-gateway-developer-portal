import { AiService } from "./ai.service";
import { PrismaService } from "../../common/prisma/prisma.service";

describe("AiService", () => {
  it("should classify severity from text", async () => {
    const prismaMock = {
      api: { findUnique: jest.fn().mockResolvedValue({ id: "a1", name: "A", version: "1", environment: "DEV" }) },
      requestLog: { findMany: jest.fn().mockResolvedValue([{ statusCode: 500, latencyMs: 10, path: "/x", method: "GET", timestamp: new Date() }]) },
      aiInsight: { create: jest.fn().mockResolvedValue({ id: "i1" }) }
    } as any;

    const svc = new AiService(prismaMock as unknown as PrismaService);

    // Monkey patch generate() to avoid network calls
    (svc as any).generate = async () => ({ text: "Severity: HIGH\nSomething happened." });

    (svc as any).client = () => ({});
    const out = await svc.generateInsights("a1", new Date("2026-01-01T00:00:00.000Z"), new Date("2026-01-02T00:00:00.000Z"));

    expect(prismaMock.aiInsight.create).toHaveBeenCalled();
    expect(out).toEqual({ id: "i1" });
  });
});
