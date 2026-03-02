import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/guards/roles.decorator";
import { Role } from "@prisma/client";
import { AiService } from "./ai.service";
import { GenerateDocsDto } from "./dto/generate-docs.dto";
import { InsightsDto } from "./dto/insights.dto";

@ApiTags("ai")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ai")
export class AiController {
  constructor(private ai: AiService) {}

  @Post("apis/:apiId/docs")
  @Roles(Role.ADMIN, Role.DEVELOPER)
  async docs(@Param("apiId") apiId: string, @Body() dto: GenerateDocsDto) {
    return this.ai.generateDocs(apiId, dto.openApi, dto.context);
  }

  @Post("metrics/insights")
  @Roles(Role.ADMIN, Role.DEVELOPER, Role.VIEWER)
  async insights(@Body() dto: InsightsDto) {
    return this.ai.generateInsights(dto.apiId, new Date(dto.rangeStart), new Date(dto.rangeEnd));
  }
}
