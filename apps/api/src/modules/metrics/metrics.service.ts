import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

function defaultRange() {
  const end = new Date();
  const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
  return { start, end };
}

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async dashboard(apiId?: string, rangeStart?: Date, rangeEnd?: Date) {
    const { start, end } = rangeStart && rangeEnd ? { start: rangeStart, end: rangeEnd } : defaultRange();

    const whereBase: any = { timestamp: { gte: start, lte: end } };
    if (apiId) whereBase.apiId = apiId;

    const total = await this.prisma.requestLog.count({ where: whereBase });

    const errorsByStatus = await this.prisma.requestLog.groupBy({
      by: ["statusCode"],
      where: { ...whereBase, statusCode: { gte: 400 } },
      _count: { statusCode: true }
    });

    const latencyAvg = await this.prisma.requestLog.aggregate({
      where: whereBase,
      _avg: { latencyMs: true }
    });

    const topApis = await this.prisma.requestLog.groupBy({
      by: ["apiId"],
      where: whereBase,
      _count: { apiId: true },
      orderBy: { _count: { apiId: "desc" } },
      take: 5
    });

    const topApiKeys = await this.prisma.requestLog.groupBy({
      by: ["apiKeyId"],
      where: whereBase,
      _count: { apiKeyId: true },
      orderBy: { _count: { apiKeyId: "desc" } },
      take: 5
    });

    return {
      rangeStart: start.toISOString(),
      rangeEnd: end.toISOString(),
      totalRequests: total,
      errorsByStatus: errorsByStatus.map((x) => ({ statusCode: x.statusCode, count: x._count.statusCode })),
      avgLatencyMs: Math.round(latencyAvg._avg.latencyMs ?? 0),
      topApis,
      topApiKeys
    };
  }
}
