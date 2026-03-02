import { All, Controller, ForbiddenException, Param, Req, Res, UseInterceptors } from "@nestjs/common";
import { ApiExcludeEndpoint, ApiTags } from "@nestjs/swagger";
import { ProxyService } from "./proxy.service";
import { Response } from "express";
import { RequestLoggingInterceptor } from "../../common/interceptors/request-logging.interceptor";

@ApiTags("proxy")
@Controller("proxy")
@UseInterceptors(RequestLoggingInterceptor)
export class ProxyController {
  constructor(private proxy: ProxyService) {}

  // Proxy ANY method to API baseUrl.
  // Example: /v1/proxy/<apiId>/anything/here
  @ApiExcludeEndpoint()
  @All(":apiId/*")
  async forward(@Param("apiId") apiId: string, @Req() req: any, @Res() res: Response) {
    const path = req.params[0] ?? "";

    // ApiKeyAuthMiddleware attaches ctx.apiId from the key record.
    if (req.gatewayContext?.apiId && req.gatewayContext.apiId !== apiId) {
      throw new ForbiddenException("API key does not belong to this apiId");
    }

    const upstream = await this.proxy.forward(apiId, path, req);

    res.status(upstream.status);
    for (const [k, v] of Object.entries(upstream.headers ?? {})) {
      if (k.toLowerCase() === "transfer-encoding") continue;
      if (typeof v !== "undefined") res.setHeader(k, v as any);
    }
    return res.send(upstream.data);
  }
}
