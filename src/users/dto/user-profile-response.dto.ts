import { HttpStatus } from '@nestjs/common';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserProfileResponseDto {
  @ApiProperty()
  @Expose()
  public status: HttpStatus;

  @Expose()
  @ApiProperty()
  public user: UserDto;
}
