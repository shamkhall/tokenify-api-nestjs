import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { DatabaseFunctions } from "../config/database/database.functions";
import { DatabaseService } from "../database/database.service";

@Module({
  controllers: [RolesController],
  providers: [RolesService, DatabaseService]
})
export class RolesModule {}
