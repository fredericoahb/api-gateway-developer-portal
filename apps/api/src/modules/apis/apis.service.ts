import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateApiDto } from "./dto/create-api.dto";
import { UpdateApiDto } from "./dto/update-api.dto";

@Injectable()
export class ApisService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.api.findMany({ orderBy: { createdAt: "desc" } });
  }

  async get(id: string) {
    const api = await this.prisma.api.findUnique({ where: { id } });
    if (!api) throw new NotFoundException("API not found");
    return api;
  }

  create(dto: CreateApiDto) {
    return this.prisma.api.create({ data: { ...dto, status: dto.status ?? "ACTIVE" } as any });
  }

  async update(id: string, dto: UpdateApiDto) {
    await this.get(id);
    return this.prisma.api.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.get(id);
    return this.prisma.api.delete({ where: { id } });
  }
}
