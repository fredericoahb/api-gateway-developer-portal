import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import { GlobalHttpExceptionFilter } from "./common/filters/global-http-exception.filter";
import { createLogger, PinoLogger } from "./common/logger/logger";

async function bootstrap() {
  const pino = createLogger();

  const app = await NestFactory.create(AppModule, {
    logger: new PinoLogger(pino) // ✅ agora é LoggerService
  });

  app.use(helmet());
  app.enableCors({ origin: true, credentials: true });
  app.setGlobalPrefix("v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle("API Gateway Developer Portal")
    .setDescription("Mini API Gateway + Developer Portal + AI Insights Engine")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("v1/docs", app, document);

  const port = Number(process.env.API_PORT ?? 3001);
  await app.listen(port);
  console.log(`API listening on :${port}`);
}

bootstrap();