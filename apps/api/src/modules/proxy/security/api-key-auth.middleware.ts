import { Injectable, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ApiKeysService } from "../../api-keys/api-keys.service";

declare global {
  // eslint-disable-next-line no-var
  var __gatewayCtx: any;
}

@Injectable()
export class ApiKeyAuthMiddleware {
  constructor(private apiKeys: ApiKeysService) {}

  async use(req: Request & any, _res: Response, next: NextFunction) {
    const secret = (req.header("X-API-Key") ?? "").trim();
    if (!secret) throw new UnauthorizedException("Missing X-API-Key header");

    const apiKey = await this.apiKeys.resolveApiKey(secret);
    if (!apiKey) throw new UnauthorizedException("Invalid or revoked API key");

    req.gatewayContext = {
      apiKeyId: apiKey.id,
      apiId: apiKey.apiId,
      limitPerMinute: apiKey.limitPerMinute,
      limitPerMonth: apiKey.limitPerMonth
    };

    next();
  }
}
