import { ApiProperty } from "@nestjs/swagger";
import { IsObject, IsOptional, IsString } from "class-validator";

export class GenerateDocsDto {
  @ApiProperty({ description: "OpenAPI JSON object" })
  @IsObject()
  openApi!: Record<string, any>;

  @ApiProperty({ required: false, description: "Extra context about the API/domain" })
  @IsOptional()
  @IsString()
  context?: string;
}
