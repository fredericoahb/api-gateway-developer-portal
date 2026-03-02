import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const start = Date.now();

    return next.handle().pipe(
      tap(async () => {
        const latencyMs = Date.now() - start;

        // Only log gateway/proxy requests where we have apiId + apiKeyId
        if (!req.gatewayContext?.apiId || !req.gatewayContext?.apiKeyId) return;

        const apiId = req.gatewayContext.apiId as string;
        const apiKeyId = req.gatewayContext.apiKeyId as string;

        await this.prisma.requestLog.create({
          data: {
            apiId,
            apiKeyId,
            method: req.method,
            path: req.originalUrl ?? req.url,
            statusCode: res.statusCode,
            latencyMs,
            ip: req.ip,
            userAgent: req.headers["user-agent"] ?? null
          }
        });
      })
    );
  }
}
