import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, RoleGuard } from 'nest-keycloak-connect';
import { AuthModule } from '../auth/auth.module';
import { appConfig, keycloakConfig } from '../config';
import { kyselyConfig } from '../config/kysely.config';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { KyselyDatabaseModule } from '../kysely/kysely.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidationSchema } from './schemas/env.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [keycloakConfig, appConfig, kyselyConfig],
      cache: true,
      validate: (config) => {
        const parsed = envValidationSchema.safeParse(config);

        if (!parsed.success) {
          //make the error message more descriptive
          const errors = parsed.error.message
            .replace('Invalid value', 'Invalid value for')
            .replace('should be', 'of type');
          throw new Error(errors);
        }

        return config;
      }
    }),
    AuthModule,
    KeycloakModule,
    KyselyDatabaseModule
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
