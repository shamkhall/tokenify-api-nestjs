import {
  privateKeyReplace,
  publicKeyReplace,
} from '../utilities/replace/key.replace';

export const Config = {
  AUTH_SCHEMA: 'auth',
  APP_SCHEMA: 'app',
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 42042,
  ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY || 'at_secret',
  REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY || 'rt_secret',
  ACCESS_TOKEN_EXPIRE: '1m',
  REFRESH_TOKEN_EXPIRE: '7d',
  SWAGGER_PASSWORD: process.env.SWAGGER_PASSWORD || '',
  AVATAR_STORAGE: 'uploads/user/avatars',
  HASH_ID_SALT: process.env.HASHID_SALT || 'salt',
  HASH_ID_LENGTH: process.env.HASHID_LENGTH || 10,

  ACCESS_TOKEN_PUBLIC_KEY: publicKeyReplace(
    process.env.ACCESS_TOKEN_PUBLIC_KEY,
  ),
  REFRESH_TOKEN_PUBLIC_KEY: publicKeyReplace(
    process.env.REFRESH_TOKEN_PUBLIC_KEY,
  ),
  ACCESS_TOKEN_PRIVATE_KEY: privateKeyReplace(
    process.env.ACCESS_TOKEN_PRIVATE_KEY,
  ),
  REFRESH_TOKEN_PRIVATE_KEY: privateKeyReplace(
    process.env.REFRESH_TOKEN_PRIVATE_KEY,
  ),
  JWE_PUBLIC_KEY: publicKeyReplace(
      process.env.JWE_PUBLIC_KEY
  ),
  JWE_PRIVATE_KEY: privateKeyReplace(
      process.env.JWE_PRIVATE_KEY
  )
};
