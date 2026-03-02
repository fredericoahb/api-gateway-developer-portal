import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";

function generateSecret(): string {
  return "ak_" + randomBytes(32).toString("hex");
}

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateApiKeyDto) {
    const api = await this.prisma.api.findUnique({ where: { id: dto.apiId } });
    if (!api) throw new NotFoundException("API not found");

    const secret = generateSecret();
    const prefix = secret.slice(0, 8);
    const hash = await bcrypt.hash(secret, 12);

    const key = await this.prisma.apiKey.create({
      data: {
        apiId: dto.apiId,
        name: dto.name,
        keyPrefix: prefix,
        keyHash: hash,
        limitPerMinute: dto.limitPerMinute,
        limitPerMonth: dto.limitPerMonth
      }
    });

    // Secret must be shown ONLY once
    return {
      id: key.id,
      apiId: key.apiId,
      name: key.name,
      keyPrefix: key.keyPrefix,
      limitPerMinute: key.limitPerMinute,
      limitPerMonth: key.limitPerMonth,
      createdAt: key.createdAt,
      secret
    };
  }

  list() {
    return this.prisma.apiKey.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        apiId: true,
        name: true,
        keyPrefix: true,
        limitPerMinute: true,
        limitPerMonth: true,
        revokedAt: true,
        createdAt: true,
        api: { select: { name: true, version: true, environment: true } }
      }
    });
  }

  async revoke(id: string) {
    const key = await this.prisma.apiKey.findUnique({ where: { id } });
    if (!key) throw new NotFoundException("API key not found");
    if (key.revokedAt) throw new BadRequestException("API key already revoked");

    return this.prisma.apiKey.update({
      where: { id },
      data: { revokedAt: new Date() }
    });
  }

  async resolveApiKey(secret: string) {
    if (!secret.startsWith("ak_")) return null;
    const prefix = secret.slice(0, 8);

    const candidates = await this.prisma.apiKey.findMany({
      where: { keyPrefix: prefix, revokedAt: null },
      include: { api: true }
    });

    for (const candidate of candidates) {
      const ok = await bcrypt.compare(secret, candidate.keyHash);
      if (ok) return candidate;
    }
    return null;
  }
}
