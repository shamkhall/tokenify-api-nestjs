import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {
  @Expose({ name: 'firstname' })
  @ApiProperty({ name: 'firstname' })
  @IsString()
  firstname: string;

  @Expose({ name: 'surname' })
  @ApiProperty({ name: 'surname' })
  @IsString()
  surname: string;

  @Expose({ name: 'role_id' })
  @ApiProperty({ name: 'role_id' })
  @IsString()
  roleId: string;
}
