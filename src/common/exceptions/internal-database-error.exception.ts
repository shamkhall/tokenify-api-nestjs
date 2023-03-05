import { HttpException, HttpStatus } from '@nestjs/common';

export class InternalDatabaseErrorException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        timestamp: new Date(),
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
