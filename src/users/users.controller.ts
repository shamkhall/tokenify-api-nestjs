import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { GetCurrentUserId } from '../common/decorators/users/get-current-user-id.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { HttpExceptionResponseDto } from '../common/dto/http-exception-response.dto';
import { FileExtensionPipe } from '../common/pipes/file-extension.pipe';
import { FileExtensionResponseDto } from '../common/dto/file-extension-response.dto';
import { nameGenerator } from '../utilities/image/get-image-name';
import {Public} from "../common/decorators/users/public.decorator";

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOkResponse({ description: 'Current user.', type: UserProfileResponseDto })
  @HttpCode(HttpStatus.OK)
  async profile(
    @GetCurrentUserId() userId: string,
  ): Promise<UserProfileResponseDto> {
    const user = await this.usersService.getUserById(userId);
    return {
      status: HttpStatus.OK,
      user,
    };
  }

  @Get(':userId')
  @ApiOkResponse({ description: 'A User By Id.', type: UserProfileResponseDto })
  @ApiParam({ name: 'userId', required: true, schema: { type: 'string' } })
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('userId') userId: string,
  ): Promise<UserProfileResponseDto> {
    const user = await this.usersService.getUserById(userId);
    return {
      status: HttpStatus.OK,
      user,
    };
  }

  // Remove "Public" attribute to guard user create action
  @Public()
  @Post('create')
  @ApiCreatedResponse({ description: 'Create a User.' })
  @ApiBadRequestResponse({
    type: HttpExceptionResponseDto,
    description: 'Username already exist',
  })
  @ApiUnprocessableEntityResponse({
    type: FileExtensionResponseDto,
    description: 'Invalid MIME type',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserDto })
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @UploadedFile(new FileExtensionPipe())
    avatar: any,
    @Body() createUserDto: CreateUserDto,
  ) {
    createUserDto.avatarName = nameGenerator(avatar?.originalname, avatar.ex);
    createUserDto.avatar = avatar?.buffer;

    await this.usersService.create(createUserDto);
    return {
      status: HttpStatus.CREATED,
      message: 'A user has been created',
    };
  }

  @Get('')
  @ApiOkResponse({ description: 'All users.' })
  @ApiQuery({ name: 'limit', required: false, schema: { type: 'number' } })
  @ApiQuery({ name: 'page', required: false, schema: { type: 'number' } })
  @HttpCode(HttpStatus.OK)
  async getAllAvailable(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    const users = await this.usersService.getAllAvailable(limit, page);
    return {
      status: HttpStatus.OK,
      message: 'All available users have been returned',
      users: users,
      total: await this.usersService.count(),
    };
  }

  @Get('deleted/users')
  @ApiOkResponse({ description: 'Deleted users.' })
  @ApiQuery({ name: 'limit', required: false, schema: { type: 'number' } })
  @ApiQuery({ name: 'page', required: false, schema: { type: 'number' } })
  @HttpCode(HttpStatus.OK)
  async deletedUsers(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    const users = await this.usersService.deletedUsers(limit, page);
    return {
      status: HttpStatus.OK,
      message: 'All deleted users have been returned',
      users: users,
    };
  }

  @Delete('/:id')
  @ApiOkResponse({ description: 'Delete user.' })
  @ApiQuery({ name: 'id', required: true, schema: { type: 'string' } })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') userId: string) {
    await this.usersService.delete(userId);
    return {
      status: HttpStatus.OK,
    };
  }

  @Patch('update/:id')
  @ApiOkResponse({ description: 'Update user.' })
  @ApiParam({ name: 'id', required: true, schema: { type: 'string' } })
  @ApiBody({ type: UpdateUserDto })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.usersService.update(userId, updateUserDto);
    return {
      status: HttpStatus.OK,
      message: 'The user has been updated',
    };
  }

  @Patch('update-password/:id')
  @ApiOkResponse({ description: `Update user's password.` })
  @ApiParam({ name: 'id', required: true, schema: { type: 'string' } })
  @ApiBody({ type: UpdatePasswordDto })
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Param('id') userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    await this.usersService.updatePassword(userId, updatePasswordDto);
    return {
      status: HttpStatus.OK,
      message: `The user's password has been updated`,
    };
  }

  @Patch('update-avatar/:id')
  @ApiOkResponse({ description: `Update user's avatar.` })
  @ApiParam({ name: 'id', required: true, schema: { type: 'string' } })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateAvatarDto })
  @UseInterceptors(FileInterceptor('avatar'))
  @HttpCode(HttpStatus.OK)
  async updateAvatar(
    @Param('id') userId: string,
    @Body() updateAvatarDto: UpdateAvatarDto,
    @UploadedFile() avatar: any,
  ) {
    updateAvatarDto.avatarName = nameGenerator(avatar.originalname, avatar.ex);
    updateAvatarDto.avatar = avatar.buffer;
    await this.usersService.updateAvatar(userId, updateAvatarDto);
    return {
      status: HttpStatus.OK,
      message: `The user's avatar has been updated`,
    };
  }
}
