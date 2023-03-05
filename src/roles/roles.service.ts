import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RoleDto } from './dto/role.dto';
import { Config } from '../config/config';
import { DatabaseFunctions } from '../config/database/database.functions';
import { HashidsUtil } from '../utilities/hashids';

@Injectable()
export class RolesService {
  hashidsUtils: HashidsUtil;

  constructor(private databaseService: DatabaseService) {
    this.hashidsUtils = new HashidsUtil();
  }

  async findAll() {
    const roles = await this.databaseService.runFunction<RoleDto>(
      RoleDto,
      `${Config.AUTH_SCHEMA}.${DatabaseFunctions.GET_ROLES}`,
      {},
    );
    roles.map(
      (role) => (role.roleId = this.hashidsUtils.encodeId(role.roleId)),
    );

    return roles;
  }
}
