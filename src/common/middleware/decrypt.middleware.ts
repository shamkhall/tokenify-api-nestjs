import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import * as jose from 'jose';
import { Config } from '../../config/config';

@Injectable()
export class DecryptMiddleware implements NestMiddleware {
  async use(req: any, res: Response, next: NextFunction) {
    try {
      if (req?.headers?.authorization) {
        const bearer = 'Bearer ';
        const token = req.headers.authorization.replace(bearer, '');
        const { plaintext, protectedHeader } = await jose.compactDecrypt(
          token,
          await jose.importPKCS8(Config.JWE_PRIVATE_KEY, 'RSA'),
        );
        const data = plaintext.toString();
        this.expired(protectedHeader.exp);
        req.headers.authorization = `${bearer}${data}`;
      }
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
    next();
  }

  expired(expDate) {
    const current = new Date().getTime();
    if (current - expDate > 0) {
      throw new UnauthorizedException();
    }
  }
}
