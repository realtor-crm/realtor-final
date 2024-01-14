import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, RoleGuard } from 'nest-keycloak-connect';
import { AuthModule } from '../auth/auth.module';
import appConfig from '../config/app.config';
import keycloakConfig from '../config/keycloak.config';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidationSchema } from './schemas/env.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [keycloakConfig, appConfig],
      cache: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true
      }
    }),
    AuthModule,
    KeycloakModule
    /*     PrismaModule */
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard }
  ]
})
export class AppModule {}
