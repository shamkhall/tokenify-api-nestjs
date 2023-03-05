export type JWTPayloadType = {
  sub: number | string;
  username: string;
  roles: Array<string>
};
