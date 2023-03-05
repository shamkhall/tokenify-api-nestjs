import { Expose } from 'class-transformer';

export class UsersCountDto {
  @Expose({ name: 'users_count' })
  usersCount: number;
}
