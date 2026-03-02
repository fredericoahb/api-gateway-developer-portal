import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiKeysService } from "./api-keys.service";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/guards/roles.decorator";
import { Role } from "@prisma/client";

@ApiTags("api-keys")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("api-keys")
export class ApiKeysController {
  constructor(private service: ApiKeysService) {}

  @Get()
  @Roles(Role.ADMIN, Role.DEVELOPER, Role.VIEWER)
  list() {
    return this.service.list();
  }

  @Post()
  @Roles(Role.ADMIN, Role.DEVELOPER)
  create(@Body() dto: CreateApiKeyDto) {
    return this.service.create(dto);
  }

  @Patch(":id/revoke")
  @Roles(Role.ADMIN, Role.DEVELOPER)
  revoke(@Param("id") id: string) {
    return this.service.revoke(id);
  }
}
