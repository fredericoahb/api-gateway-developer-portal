import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApisService } from "./apis.service";
import { CreateApiDto } from "./dto/create-api.dto";
import { UpdateApiDto } from "./dto/update-api.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { Roles } from "../../common/guards/roles.decorator";
import { Role } from "@prisma/client";
import { RolesGuard } from "../../common/guards/roles.guard";

@ApiTags("apis")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("apis")
export class ApisController {
  constructor(private service: ApisService) {}

  @Get()
  @Roles(Role.ADMIN, Role.DEVELOPER, Role.VIEWER)
  list() {
    return this.service.list();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.DEVELOPER, Role.VIEWER)
  get(@Param("id") id: string) {
    return this.service.get(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.DEVELOPER)
  create(@Body() dto: CreateApiDto) {
    return this.service.create(dto);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.DEVELOPER)
  update(@Param("id") id: string, @Body() dto: UpdateApiDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
