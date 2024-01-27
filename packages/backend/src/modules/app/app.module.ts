import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, RoleGuard } from 'nest-keycloak-connect';
import { AuthModule } from '../auth/auth.module';
import { appConfig, keycloakConfig } from '../config';
import { jwtConfig } from '../config/jwt.config';
import { kyselyConfig } from '../config/kysely.config';
import { redisConfig } from '../config/redis.config';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { KyselyDatabaseModule } from '../kysely/kysely.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envSchema } from './schemas/env.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [keycloakConfig, appConfig, kyselyConfig, jwtConfig, redisConfig],
      cache: true,
      validate: (config) => {
        const parsed = envSchema.safeParse(config);

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
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (redisConf: ConfigType<typeof redisConfig>) => {
        return {
          type: 'single',
          url: redisConf.redisUrl
        };
      }
    }),
    AuthModule,
    UserModule,
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
