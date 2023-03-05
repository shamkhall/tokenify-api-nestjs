import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UserDto } from './dto/user.dto';
import { Config } from '../config/config';
import { DatabaseFunctions } from '../config/database/database.functions';
import { DatabaseProcedures } from '../config/database/database.procedures';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon from 'argon2';
import { HashidsUtil } from '../utilities/hashids';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { plainToHash } from '../utilities/password-manager';
import { UsersCountDto } from './dto/users-count.dto';
import { createImage } from '../utilities/image/create-image';
import { deleteImage } from '../utilities/image/delete-image';

@Injectable()
export class UsersService {
  hashidsUtils: HashidsUtil;

  constructor(private databaseService: DatabaseService) {
    this.hashidsUtils = new HashidsUtil();
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await argon.hash(createUserDto.password);
    const decodedRoleId = this.hashidsUtils.decodeId(createUserDto.roleId);
    if (decodedRoleId === undefined) {
      throw new BadRequestException('Role ID is not correct');
    }
    await this.databaseService.runProcedure<CreateUserDto>(
      CreateUserDto,
      `${Config.AUTH_SCHEMA}.${DatabaseProcedures.CREATE_USER}`,
      {
        _username: createUserDto.username,
        _firstname: createUserDto.firstname,
        _surname: createUserDto.surname,
        _password: hashedPassword,
        _avatar: createUserDto.avatarName || '',
        _role_id: decodedRoleId,
      },
    );
    if (
      createUserDto.avatar === undefined ||
      createUserDto.avatarName === undefined
    ) {
      return;
    }

    await createImage(
      createUserDto.avatar,
      createUserDto.avatarName,
      Config.AVATAR_STORAGE,
    );
  }

  async getUserById(userId: string): Promise<UserDto> {
    const decodedUserID = this.hashidsUtils.decodeId(userId);
    if (decodedUserID === undefined) {
      throw new BadRequestException('User ID is not correct');
    }

    const result = await this.databaseService.runFunction<UserDto>(
      UserDto,
      `${Config.AUTH_SCHEMA}.${DatabaseFunctions.GET_USER_BY_ID}`,
      {
        _user_id: decodedUserID,
      },
    );

    const user = result[0];

    user.roleId = this.hashidsUtils.encodeId(user.roleId);
    user.userId = this.hashidsUtils.encodeId(user.userId);

    return user;
  }

  async getAllAvailable(limit: number, page: number) {
    const offset = (page - 1) * limit;
    const users = await this.databaseService.runFunction<UserDto>(
      UserDto,
      `${Config.AUTH_SCHEMA}.${DatabaseFunctions.GET_USERS}`,
      {
        _limit: limit,
        _offset: offset,
      },
    );

    users.map((user) => {
      user.userId = this.hashidsUtils.encodeId(user.userId);
      user.roleId = this.hashidsUtils.encodeId(user.roleId);
    });

    return users;
  }

  async delete(userId: string) {
    const decodedUserID = this.hashidsUtils.decodeId(userId);
    if (decodedUserID === undefined) {
      throw new BadRequestException('User ID is not correct');
    }

    const avatarPath = await this.targetAvatarPath(userId);
    await deleteImage(avatarPath);

    return await this.databaseService.runProcedure<UserDto>(
      UserDto,
      `${Config.AUTH_SCHEMA}.${DatabaseProcedures.SOFT_DELETE_USER}`,
      {
        _user_id: decodedUserID,
      },
    );
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const decodedUserID = this.hashidsUtils.decodeId(userId);
    const decodedRoleID = this.hashidsUtils.decodeId(updateUserDto.roleId);
    if (decodedUserID === undefined) {
      throw new BadRequestException('User ID is not correct');
    }
    if (decodedRoleID === undefined) {
      throw new BadRequestException('Role ID is not correct');
    }

    return await this.databaseService.runProcedure<UpdateUserDto>(
      UpdateUserDto,
      `${Config.AUTH_SCHEMA}.${DatabaseProcedures.UPDATE_USER}`,
      {
        _user_id: decodedUserID,
        _firstname: updateUserDto.firstname,
        _surname: updateUserDto.surname,
        _role_id: decodedRoleID,
      },
    );
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const decodedUserID = this.hashidsUtils.decodeId(userId);
    if (decodedUserID === undefined) {
      throw new BadRequestException('User ID is not correct');
    }
    const hashedPassword = await plainToHash(updatePasswordDto.password);

    return await this.databaseService.runProcedure<UpdatePasswordDto>(
      UpdatePasswordDto,
      `${Config.AUTH_SCHEMA}.${DatabaseProcedures.UPDATE_USER_PASSWORD}`,
      {
        _user_id: decodedUserID,
        _new_password: hashedPassword,
      },
    );
  }

  async updateAvatar(userId: string, updateAvatarDto: UpdateAvatarDto) {
    const decodedUserID = this.hashidsUtils.decodeId(userId);
    if (decodedUserID === undefined) {
      throw new BadRequestException('User ID is not correct');
    }
    const avatarPath = await this.targetAvatarPath(userId);
    await deleteImage(avatarPath);
    await createImage(updateAvatarDto.avatar, updateAvatarDto.avatarName, Config.AVATAR_STORAGE);

    return await this.databaseService.runProcedure<UpdateAvatarDto>(
      UpdateAvatarDto,
      `${Config.AUTH_SCHEMA}.${DatabaseProcedures.UPDATE_USER_AVATAR}`,
      {
        _user_id: decodedUserID,
        _user_avatar: updateAvatarDto.avatarName,
      },
    );
  }

  async deletedUsers(limit: number, page: number) {
    const offset = (page - 1) * limit;
    const users = await this.databaseService.runFunction<UserDto>(
      UserDto,
      `${Config.AUTH_SCHEMA}.${DatabaseFunctions.GET_TRASHED_USERS}`,
      {
        _limit: limit,
        _offset: offset,
      },
    );
    users.map((user) => {
      user.userId = this.hashidsUtils.encodeId(user.userId);
      user.roleId = this.hashidsUtils.encodeId(user.roleId);
    });
    return users;
  }

  // helper functions

  async count(): Promise<number> {
    const usersCountRawResponse: UsersCountDto[] =
      await this.databaseService.runFunction<UsersCountDto>(
        UsersCountDto,
        `${Config.AUTH_SCHEMA}.${DatabaseFunctions.AUTH_USERS_COUNT}`,
        {},
      );
    if (
      Array.isArray(usersCountRawResponse) &&
      usersCountRawResponse.length > 0
    )
      return usersCountRawResponse[0].usersCount;
    else return 0;
  }

  async targetAvatarPath(userId) {
    const data = await this.getUserById(userId);
    const user = data[0];

    if (!user) throw new BadRequestException('User is not found');
    return `${Config.AVATAR_STORAGE}/${user.avatar}`;
  }
}

