import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: "admin@local.dev" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "admin12345" })
  @IsString()
  @MinLength(8)
  password!: string;
}
