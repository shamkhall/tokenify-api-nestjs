import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Config } from './config/config';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { LoggerModule } from 'nestjs-pino';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guards/auth/access-token.guard';
import { DecryptMiddleware } from './common/middleware/decrypt.middleware';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    DatabaseModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: Config.DATABASE_URL,
    }),
    RolesModule,
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: false,
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DecryptMiddleware)
      .exclude({ path: 'api/v1/auth/login', method: RequestMethod.POST })
      .exclude({ path: 'api/v1/users/create', method: RequestMethod.POST })
      .exclude({ path: 'api/v1/roles', method: RequestMethod.GET })
      .forRoutes('*');
  }
}
