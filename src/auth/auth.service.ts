import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { LoginDto } from './dto/login.dto';
import { Config } from '../config/config';
import { DatabaseFunctions } from '../config/database/database.functions';
import { UserDto } from '../users/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { JWTPayloadType } from './types/jwt-payload.type';
import { Tokens } from './types/tokens.type';
import { DatabaseProcedures } from '../config/database/database.procedures';
import { DeviceDto } from './dto/device.dto';
import UAParser from 'ua-parser-js';
import { GetDeviceIdDto } from './dto/get-device-id.dto';
import { GetSessionIdDto } from './dto/get-session-id.dto';
import { SessionDto } from './dto/session.dto';
import { HashidsUtil } from '../utilities/hashids';
import { plainToHash, validator } from '../utilities/password-manager';
import { RoleDto } from '../roles/dto/role.dto';
import * as jose from 'jose';
import { getExpTime } from '../utilities/time/get-ms.time';

@Injectable()
export class AuthService {
  hashidsUtils: HashidsUtil;

  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {
    this.hashidsUtils = new HashidsUtil();
  }

  async login(loginDto: LoginDto, deviceDto: DeviceDto, ip: string) {
    // this object is for deviceId
    let createdDevice = [
      { deviceId: this.hashidsUtils.decodeId(loginDto.deviceId) },
    ];

    const user = await this.getUserByUsername(loginDto.username);
    const roleName = await this.getRoleByUsername(user.roleId);

    const validPassword = await validator(user.password, loginDto.password);

    if (!validPassword)
      throw new HttpException(
        'Password is incorrect!',
        HttpStatus.UNAUTHORIZED,
      );

    if (createdDevice[0].deviceId === undefined) {
      createdDevice = await this.databaseService.runProcedure<GetDeviceIdDto>(
        GetDeviceIdDto,
        `${Config.AUTH_SCHEMA}.${DatabaseProcedures.ADD_DEVICE}`,
        {
          _user_id: user.userId,
          _os: deviceDto.osName,
          _os_major: deviceDto.osMajor,
          _params: deviceDto.params,
        },
      );
    }
    const tokens: Tokens = await this.getTokens(user.userId, user.username, [
      roleName,
    ]);

    const hashedToken = await plainToHash(tokens.refreshToken);

    const deviceId = createdDevice[0].deviceId;
    const sessionData =
      await this.databaseService.runProcedure<GetSessionIdDto>(
        GetSessionIdDto,
        `${Config.AUTH_SCHEMA}.${DatabaseProcedures.CREATE_SESSION}`,
        {
          _user_id: user.userId,
          _device_id: deviceId,
          _refresh_token: hashedToken,
          _ip_address: ip,
        },
      );
    const sessionId = sessionData[0].sessionId;
    return {
      sessionId: this.hashidsUtils.encodeId(sessionId),
      deviceId: this.hashidsUtils.encodeId(deviceId),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async refreshTokens(
    sessionId: string,
    refreshToken: string,
    username: string,
  ) {
    const session = await this.getSession(sessionId);
    const user = await this.getUserByUsername(username);
    const roleName = await this.getRoleByUsername(user.roleId);
    if (!session) {
      throw new HttpException('Session is not found!', HttpStatus.UNAUTHORIZED);
    }

    const isValid = validator(session.refreshToken, refreshToken);

    if (!isValid) {
      throw new HttpException(
        'Refresh token is not valid!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const tokens = await this.getTokens(session.userId, username, [roleName]);

    const refreshTokenHashed = await plainToHash(refreshToken);

    await this.databaseService.runProcedure<SessionDto>(
      SessionDto,
      `${Config.AUTH_SCHEMA}.${DatabaseProcedures.UPDATE_TOKEN_BY_SESSION_ID}`,
      {
        _session_id: this.hashidsUtils.decodeId(sessionId),
        _token: refreshTokenHashed,
      },
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(sessionId: string) {
    const session = await this.getSession(sessionId);

    if (!session) {
      throw new HttpException('Session is not found!', HttpStatus.UNAUTHORIZED);
    }

    await this.databaseService.runProcedure<SessionDto>(
      SessionDto,
      `${Config.AUTH_SCHEMA}.${DatabaseProcedures.INACTIVATE_SESSION}`,
      {
        _session_id: this.hashidsUtils.decodeId(sessionId),
      },
    );
  }

  // helper functions
  async getSession(sessionId: string) {
    const decodedSessionId = this.hashidsUtils.decodeId(sessionId);
    if (decodedSessionId === undefined) {
      throw new HttpException(
        'Session ID is not correct!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const data = await this.databaseService.runFunction<SessionDto>(
      SessionDto,
      `${Config.AUTH_SCHEMA}.${DatabaseFunctions.GET_SESSION}`,
      {
        _session_id: decodedSessionId,
      },
    );
    return data[0];
  }

  getDeviceParams(userAgent: string, imei: string | undefined) {
    const data = new UAParser(userAgent);
    const deviceDto = new DeviceDto();
    deviceDto.osName = data.getOS().name || '';
    deviceDto.osMajor = data.getOS().version || '';
    deviceDto.params = {
      browser: data.getBrowser().name || '',
      browserMajor: data.getBrowser().major || '',
      imei: imei || '',
      userAgent: userAgent || '',
    };
    return deviceDto;
  }

  async getTokens(
    userId: number | string,
    username: string,
    roles: string[],
  ): Promise<Tokens> {
    const encodedUserId = this.hashidsUtils.encodeId(userId);
    const payload: JWTPayloadType = {
      sub: encodedUserId,
      username: username,
      roles: roles,
    };
    const { pkcs8A, jwePub, pkcs8R } = await this.getKeys();

    const [accessToken, refreshToken] = await Promise.all([
      this.getToken(jwePub, pkcs8A, Config.ACCESS_TOKEN_EXPIRE, payload),
      this.getToken(jwePub, pkcs8R, Config.REFRESH_TOKEN_EXPIRE, payload),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async getToken(jwePuKey, prKey, exp, payload) {

    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'RS256' })
      .setExpirationTime(exp)
      .sign(prKey);

    return await new jose.CompactEncrypt(
      new TextEncoder().encode(
        jwt,
      ),
    )
      .setProtectedHeader({
        alg: 'RSA-OAEP-256',
        enc: 'A256GCM',
        exp: getExpTime(exp),
      })
      .encrypt(jwePuKey);
  }

  async getKeys() {
    const privateKeyAccess = Config.ACCESS_TOKEN_PRIVATE_KEY,
      privateKeyRefresh = Config.REFRESH_TOKEN_PRIVATE_KEY,
      jwePublicKey = Config.JWE_PUBLIC_KEY;
    const algo = 'RS256';
    const pkcs8A = await jose.importPKCS8(privateKeyAccess, algo);
    const pkcs8R = await jose.importPKCS8(privateKeyRefresh, algo);
    const jwePub = await jose.importSPKI(jwePublicKey, algo);
    return { pkcs8A, jwePub, pkcs8R };
  }

  async getUserByUsername(username: string) {
    const data = await this.databaseService.runFunction<UserDto>(
      UserDto,
      `${Config.AUTH_SCHEMA}.${DatabaseFunctions.AUTHORIZE_USER}`,
      {
        _username: username,
      },
    );
    const user = data[0];

    if (!user)
      throw new HttpException(
        'Username is not found!',
        HttpStatus.UNAUTHORIZED,
      );
    return user;
  }

  async getRoleByUsername(roleId): Promise<string> {
    const roles = await this.databaseService.runFunction<RoleDto>(
      RoleDto,
      `${Config.AUTH_SCHEMA}.${DatabaseFunctions.GET_ROLES}`,
      {},
    );

    for (const role of roles) {
      if (role.roleId === roleId) return role.roleKey;
    }
    throw new BadRequestException('User has not any role');
  }
}
