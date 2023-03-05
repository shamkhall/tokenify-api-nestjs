import { Expose } from 'class-transformer';
import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @Expose({ name: 'username' })
  @ApiProperty({ name: 'username' })
  @IsString()
  username: string;

  @Expose({ name: 'firstname' })
  @ApiProperty({ name: 'firstname' })
  @IsString()
  firstname: string;

  @Expose({ name: 'surname' })
  @ApiProperty({ name: 'surname' })
  @IsString()
  surname: string;

  @Expose({ name: 'password' })
  @ApiProperty({ name: 'password' })
  @IsString()
  password: string;

  @Expose({ name: 'role_id' })
  @ApiProperty({ name: 'role_id' })
  @IsString()
  roleId: string;

  @Expose({ name: 'avatar' })
  @ApiProperty({ name: 'avatar', type: 'string', format: 'binary', required: false })
  @IsOptional()
  @IsString()
  avatar: string;

  @Expose({ name: 'avatar_name' })
  @IsOptional()
  avatarName: string;
}
