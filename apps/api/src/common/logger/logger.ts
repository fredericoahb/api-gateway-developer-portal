import pino, { Logger } from "pino";
import { LoggerService, LogLevel } from "@nestjs/common";

export function createLogger(): Logger {
  const isProd = process.env.NODE_ENV === "production";
  return pino({
    level: process.env.LOG_LEVEL ?? "info",
    transport: isProd
      ? undefined
      : {
          target: "pino-pretty",
          options: { singleLine: true, translateTime: "SYS:standard" }
        }
  });
}

export class PinoLogger implements LoggerService {
  constructor(private readonly logger: Logger) {}

  log(message: any, ...optionalParams: any[]) {
    this.logger.info({ optionalParams }, message);
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger.error({ optionalParams }, message);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn({ optionalParams }, message);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug({ optionalParams }, message);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.logger.trace({ optionalParams }, message);
  }

  setLogLevels?(levels: LogLevel[]) {
    // opcional: Nest pode chamar isso em alguns cenários
    // pino não usa níveis do mesmo jeito do Nest, então deixamos no-op.
    void levels;
  }
}
