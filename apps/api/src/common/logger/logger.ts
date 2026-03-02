import pino, { Logger } from "pino";
import { LoggerService } from "@nestjs/common";

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

// ✅ Adapter: Nest LoggerService -> Pino
export class PinoLogger implements LoggerService {
  constructor(private readonly logger: Logger) { }

  log(message: any, ...optionalParams: any[]) {
    this.logger.info({ optionalParams }, message);
  }

  error(message: any, ...optionalParams: any[]) {
    const err = optionalParams.find((p) => p instanceof Error);
    this.logger.error({ err, optionalParams }, message);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn({ optionalParams }, message);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug({ optionalParams }, message);
  }

  verbose(message: any, ...optionalParams: any[]) {
    // verbose no Nest -> trace no pino
    this.logger.trace({ optionalParams }, message);
  }
}