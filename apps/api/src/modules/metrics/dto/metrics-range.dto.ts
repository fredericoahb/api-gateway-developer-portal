import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsOptional } from "class-validator";

export class MetricsRangeDto {
  @ApiProperty({ required: false, example: "2026-01-01T00:00:00.000Z" })
  @IsOptional()
  @IsISO8601()
  rangeStart?: string;

  @ApiProperty({ required: false, example: "2026-01-08T00:00:00.000Z" })
  @IsOptional()
  @IsISO8601()
  rangeEnd?: string;
}
