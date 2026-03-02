import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsString } from "class-validator";

export class InsightsDto {
  @ApiProperty() @IsString() apiId!: string;
  @ApiProperty() @IsISO8601() rangeStart!: string;
  @ApiProperty() @IsISO8601() rangeEnd!: string;
}
