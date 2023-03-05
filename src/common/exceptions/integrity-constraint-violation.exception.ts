import { HttpException, HttpStatus } from '@nestjs/common';

export class IntegrityConstraintViolationException extends HttpException {
  constructor(message: string, columns: Array<string>) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'unique_error',
        affected_columns: columns,
        message: message,
        timestamp: new Date(),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
