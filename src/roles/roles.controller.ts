import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {Public} from "../common/decorators/users/public.decorator";

@ApiTags('roles')
@Controller('roles')
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Remove "Public" attribute to guard get roles action
  @Public()
  @Get()
  @ApiOkResponse({ description: 'User roles' })
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const roles = await this.rolesService.findAll();
    return {
      status: HttpStatus.OK,
      message: 'User roles have been returned',
      data: roles,
    };
  }
}
