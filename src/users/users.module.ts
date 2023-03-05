import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseService } from "../database/database.service";

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, DatabaseService],
})
export class UsersModule {}
