import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Config } from '../../config/config';
import { Request } from 'express';
import { ForbiddenException } from '@nestjs/common';
import { JWTPayloadType } from '../types/jwt-payload.type';
import { RefreshTokenType } from '../types/refresh-token.type';

export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Config.REFRESH_TOKEN_PUBLIC_KEY,
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JWTPayloadType): RefreshTokenType {
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    if (!refreshToken) throw new ForbiddenException('refresh token malformed');

    return {
      ...payload,
      refreshToken,
    };
  }
}
