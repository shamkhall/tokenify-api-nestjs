import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Config } from '../../config/config';
import { Injectable } from '@nestjs/common';
import { JWTPayloadType } from '../types/jwt-payload.type';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Config.ACCESS_TOKEN_PUBLIC_KEY,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JWTPayloadType) {
    return payload;
  }
}
