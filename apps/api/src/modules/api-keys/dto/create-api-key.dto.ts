import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Min } from "class-validator";

export class CreateApiKeyDto {
  @ApiProperty() @IsString() apiId!: string;
  @ApiProperty() @IsString() name!: string;

  @ApiProperty({ example: 60 })
  @IsInt() @Min(1)
  limitPerMinute!: number;

  @ApiProperty({ example: 100000 })
  @IsInt() @Min(1)
  limitPerMonth!: number;
}
