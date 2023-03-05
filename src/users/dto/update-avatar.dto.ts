import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAvatarDto {
  @Expose({ name: 'avatar' })
  @ApiProperty({ name: 'avatar', type: 'string', format: 'binary' })
  avatar: string;

  @Expose({ name: 'avatar_name' })
  avatarName: string;
}
