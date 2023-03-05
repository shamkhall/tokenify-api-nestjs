import { Expose } from 'class-transformer';

export class RoleDto {
  @Expose({ name: 'role_id' })
  roleId: number | string;
  @Expose({ name: 'key' })
  roleKey: string;
  @Expose({ name: 'name' })
  roleName: string;
  @Expose({ name: 'created_at' })
  createdAt: Date;
  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
