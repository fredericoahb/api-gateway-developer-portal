import { Injectable } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { RedisService } from "./redis.service";
import { PrismaService } from "../../../common/prisma/prisma.service";

function yyyymmddhhmm(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}`;
}
function yyyymm(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}`;
}

@Injectable()
export class RateLimitMiddleware {
  constructor(private redis: RedisService, private prisma: PrismaService) {}

  async use(req: Request & any, res: Response, next: NextFunction) {
    const ctx = req.gatewayContext;
    if (!ctx?.apiKeyId) return next();

    const now = new Date();
    const minuteKey = `rl:m:${ctx.apiKeyId}:${yyyymmddhhmm(now)}`;
    const monthKey = `rl:mo:${ctx.apiKeyId}:${yyyymm(now)}`;

    const pipe = this.redis.raw.pipeline();
    pipe.incr(minuteKey);
    pipe.expire(minuteKey, 70); // keep a bit longer than 60s window
    pipe.incr(monthKey);
    pipe.expire(monthKey, 60 * 60 * 24 * 32); // approx

    const results = await pipe.exec();
    const perMinute = Number(results?.[0]?.[1] ?? 0);
    const perMonth = Number(results?.[2]?.[1] ?? 0);

    res.setHeader("X-RateLimit-Minute-Remaining", String(Math.max(0, ctx.limitPerMinute - perMinute)));
    res.setHeader("X-RateLimit-Month-Remaining", String(Math.max(0, ctx.limitPerMonth - perMonth)));

    if (perMinute > ctx.limitPerMinute) {
      await this.prisma.rateLimitViolation.create({
        data: {
          apiId: ctx.apiId,
          apiKeyId: ctx.apiKeyId,
          type: "PER_MINUTE",
          limit: ctx.limitPerMinute,
          currentCount: perMinute
        }
      });
      return res.status(429).json({ message: "Rate limit exceeded (per minute)" });
    }

    if (perMonth > ctx.limitPerMonth) {
      await this.prisma.rateLimitViolation.create({
        data: {
          apiId: ctx.apiId,
          apiKeyId: ctx.apiKeyId,
          type: "PER_MONTH",
          limit: ctx.limitPerMonth,
          currentCount: perMonth
        }
      });
      return res.status(429).json({ message: "Rate limit exceeded (per month)" });
    }

    next();
  }
}
