import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdatePasswordDto {
  @Expose({ name: 'password' })
  @ApiProperty({ name: 'password' })
  @IsString()
  password: string;
}
