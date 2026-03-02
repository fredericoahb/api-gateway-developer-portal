import pino from "pino";

export function createLogger() {
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
