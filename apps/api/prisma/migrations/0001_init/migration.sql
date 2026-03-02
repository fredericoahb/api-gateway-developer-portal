-- This migration was generated manually to keep the repo self-contained.
-- You can regenerate with: prisma migrate dev --name init

-- Enums
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DEVELOPER', 'VIEWER');
CREATE TYPE "ApiEnvironment" AS ENUM ('DEV', 'HML', 'PRD');
CREATE TYPE "ApiStatus" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "ViolationType" AS ENUM ('PER_MINUTE', 'PER_MONTH');
CREATE TYPE "InsightSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- Tables
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'VIEWER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Api" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "version" TEXT NOT NULL,
  "baseUrl" TEXT NOT NULL,
  "environment" "ApiEnvironment" NOT NULL,
  "status" "ApiStatus" NOT NULL DEFAULT 'ACTIVE',
  "ownerTeam" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Api_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ApiKey" (
  "id" TEXT NOT NULL,
  "apiId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "keyPrefix" TEXT NOT NULL,
  "keyHash" TEXT NOT NULL,
  "limitPerMinute" INTEGER NOT NULL,
  "limitPerMonth" INTEGER NOT NULL,
  "revokedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ApiKey_apiId_idx" ON "ApiKey"("apiId");
CREATE INDEX "ApiKey_keyPrefix_idx" ON "ApiKey"("keyPrefix");

ALTER TABLE "ApiKey"
ADD CONSTRAINT "ApiKey_apiId_fkey"
FOREIGN KEY ("apiId") REFERENCES "Api"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "RequestLog" (
  "id" TEXT NOT NULL,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "apiId" TEXT NOT NULL,
  "apiKeyId" TEXT NOT NULL,
  "method" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "statusCode" INTEGER NOT NULL,
  "latencyMs" INTEGER NOT NULL,
  "ip" TEXT,
  "userAgent" TEXT,
  CONSTRAINT "RequestLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RequestLog_apiId_timestamp_idx" ON "RequestLog"("apiId","timestamp");
CREATE INDEX "RequestLog_apiKeyId_timestamp_idx" ON "RequestLog"("apiKeyId","timestamp");

ALTER TABLE "RequestLog"
ADD CONSTRAINT "RequestLog_apiId_fkey"
FOREIGN KEY ("apiId") REFERENCES "Api"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "RequestLog"
ADD CONSTRAINT "RequestLog_apiKeyId_fkey"
FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "RateLimitViolation" (
  "id" TEXT NOT NULL,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "apiId" TEXT NOT NULL,
  "apiKeyId" TEXT NOT NULL,
  "type" "ViolationType" NOT NULL,
  "limit" INTEGER NOT NULL,
  "currentCount" INTEGER NOT NULL,
  CONSTRAINT "RateLimitViolation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RateLimitViolation_apiKeyId_timestamp_idx" ON "RateLimitViolation"("apiKeyId","timestamp");

ALTER TABLE "RateLimitViolation"
ADD CONSTRAINT "RateLimitViolation_apiId_fkey"
FOREIGN KEY ("apiId") REFERENCES "Api"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "RateLimitViolation"
ADD CONSTRAINT "RateLimitViolation_apiKeyId_fkey"
FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "AiGeneratedDoc" (
  "id" TEXT NOT NULL,
  "apiId" TEXT NOT NULL,
  "markdown" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AiGeneratedDoc_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiGeneratedDoc_apiId_createdAt_idx" ON "AiGeneratedDoc"("apiId","createdAt");

ALTER TABLE "AiGeneratedDoc"
ADD CONSTRAINT "AiGeneratedDoc_apiId_fkey"
FOREIGN KEY ("apiId") REFERENCES "Api"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "AiInsight" (
  "id" TEXT NOT NULL,
  "apiId" TEXT NOT NULL,
  "rangeStart" TIMESTAMP(3) NOT NULL,
  "rangeEnd" TIMESTAMP(3) NOT NULL,
  "content" TEXT NOT NULL,
  "severity" "InsightSeverity" NOT NULL DEFAULT 'LOW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AiInsight_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiInsight_apiId_createdAt_idx" ON "AiInsight"("apiId","createdAt");

ALTER TABLE "AiInsight"
ADD CONSTRAINT "AiInsight_apiId_fkey"
FOREIGN KEY ("apiId") REFERENCES "Api"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
