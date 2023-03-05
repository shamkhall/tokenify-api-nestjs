import { Logger, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { DataSource } from 'typeorm';
import { IntegrityConstraintViolationException } from '../common/exceptions/integrity-constraint-violation.exception';
import { DatabaseStatus } from "../common/exceptions/database-status";
import { InternalDatabaseErrorException } from "../common/exceptions/internal-database-error.exception";
import { getColumns, getErrorMessage } from "../common/exceptions/get-error-message";

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  constructor(private connection: DataSource) {}

  private async execute<T>(
    type: ClassConstructor<T>,
    query: string,
    parameters?: object,
  ): Promise<T[]> {
    try {
      const queryResult = await this.connection.query(
        query,
        Object.values(parameters),
      );
      return plainToInstance<T, object[]>(type, queryResult, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error({ id: 'database-error' }, error.message);
      if(error.code === DatabaseStatus.UNIQUE_VIOLATION) {
        const message = getErrorMessage(error);
        const columns = getColumns(error);
        throw new IntegrityConstraintViolationException(message, columns);
      }
      throw new InternalDatabaseErrorException();
    }
  }

  private static createSqlSignature(name: string, parameters?: object): string {
    const params = [];
    let i = 1;
    if (parameters)
      for (const key of Object.keys(parameters)) {
        params.push(`${key} => $${i++}`);
      }
    const paramsToString = params.join(', ');

    return `${name}( ${paramsToString} )`;
  }

  public runProcedure<T>(
    type: ClassConstructor<T>,
    procedureName: string,
    args?: object,
  ): Promise<T[]> {
    const query = `CALL ${DatabaseService.createSqlSignature(
      procedureName,
      args,
    )}`;
    return this.execute<T>(type, query, args);
  }

  public runFunction<T>(
    type: ClassConstructor<T>,
    functionName: string,
    args?: object,
  ): Promise<T[]> {
    const query = `SELECT * from ${DatabaseService.createSqlSignature(
      functionName,
      args,
    )};`;
    return this.execute<T>(type, query, args);
  }
}
