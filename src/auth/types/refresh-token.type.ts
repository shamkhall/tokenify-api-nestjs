import { JWTPayloadType } from './jwt-payload.type';

export type RefreshTokenType = JWTPayloadType & {
  refreshToken: string;
};
