import { ApiProperty } from "@nestjs/swagger";
import { ApiEnvironment, ApiStatus } from "@prisma/client";
import { IsEnum, IsString, IsUrl } from "class-validator";

export class CreateApiDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() version!: string;
  @ApiProperty() @IsUrl({ require_tld: false }) baseUrl!: string;
  @ApiProperty({ enum: ApiEnvironment }) @IsEnum(ApiEnvironment) environment!: ApiEnvironment;
  @ApiProperty({ enum: ApiStatus, required: false }) @IsEnum(ApiStatus) status?: ApiStatus;
  @ApiProperty() @IsString() ownerTeam!: string;
}
