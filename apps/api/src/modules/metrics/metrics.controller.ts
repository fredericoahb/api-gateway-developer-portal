import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/guards/roles.decorator";
import { Role } from "@prisma/client";
import { MetricsService } from "./metrics.service";
import { MetricsRangeDto } from "./dto/metrics-range.dto";

@ApiTags("metrics")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("metrics")
export class MetricsController {
  constructor(private metrics: MetricsService) {}

  @Get("dashboard")
  @Roles(Role.ADMIN, Role.DEVELOPER, Role.VIEWER)
  async dashboard(
    @Query("apiId") apiId?: string,
    @Query() range?: MetricsRangeDto
  ) {
    const start = range?.rangeStart ? new Date(range.rangeStart) : undefined;
    const end = range?.rangeEnd ? new Date(range.rangeEnd) : undefined;
    return this.metrics.dashboard(apiId, start, end);
  }
}
