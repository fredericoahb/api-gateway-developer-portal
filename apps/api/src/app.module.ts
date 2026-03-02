import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { z } from "zod";
import { PrismaModule } from "./common/prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ApisModule } from "./modules/apis/apis.module";
import { ApiKeysModule } from "./modules/api-keys/api-keys.module";
import { ProxyModule } from "./modules/proxy/proxy.module";
import { MetricsModule } from "./modules/metrics/metrics.module";
import { AiModule } from "./modules/ai/ai.module";
import { HealthModule } from "./modules/health/health.module";

const EnvSchema = z.object({
  API_PORT: z.string().optional(),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("12h"),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  ADMIN_NAME: z.string().optional(),
  GEMINI_API_KEY: z.string().optional()
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => {
        const parsed = EnvSchema.safeParse(env);
        if (!parsed.success) {
          // eslint-disable-next-line no-console
          console.error(parsed.error.format());
          throw new Error("Invalid environment variables");
        }
        return parsed.data;
      }
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ApisModule,
    ApiKeysModule,
    ProxyModule,
    MetricsModule,
    AiModule,
    HealthModule
  ]
})
export class AppModule {}
