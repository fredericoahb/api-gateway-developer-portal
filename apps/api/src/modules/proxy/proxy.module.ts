import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ProxyController } from "./proxy.controller";
import { ProxyService } from "./proxy.service";
import { ApiKeyAuthMiddleware } from "./security/api-key-auth.middleware";
import { RateLimitMiddleware } from "./security/rate-limit.middleware";
import { RedisService } from "./security/redis.service";
import { ApiKeysModule } from "../api-keys/api-keys.module";
import { ApisModule } from "../apis/apis.module";

@Module({
  imports: [ApiKeysModule, ApisModule],
  controllers: [ProxyController],
  providers: [ProxyService, RedisService, RateLimitMiddleware, ApiKeyAuthMiddleware]
})
export class ProxyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyAuthMiddleware, RateLimitMiddleware)
      .forRoutes({ path: "proxy/*", method: RequestMethod.ALL });
  }
}
