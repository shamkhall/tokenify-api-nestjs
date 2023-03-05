import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ type: 'string' })
  @Expose({ name: 'user_id' })
  userId: number | string;

  @ApiProperty()
  @Expose({ name: 'username' })
  username: string;

  @ApiProperty()
  @Expose({ name: 'firstname' })
  firstname: string;

  @ApiProperty()
  @Expose({ name: 'surname' })
  surname: string;

  @Expose({ name: 'password' })
  password: string;

  @ApiProperty()
  @Expose({ name: 'avatar' })
  avatar: string;

  @Expose({ name: 'refresh_token' })
  refreshToken: string;

  @ApiProperty({ type: 'string' })
  @Expose({ name: 'role_id' })
  roleId: number | string;

  @Expose({ name: 'created_at' })
  createdAt: number;

  @Expose({ name: 'updated_at' })
  updatedAt: number;
}
