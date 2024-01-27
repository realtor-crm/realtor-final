import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { redisStore } from 'cache-manager-redis-yet';
import { AuthGuard, RoleGuard } from 'nest-keycloak-connect';
import { appConfig, jwtConfig, keycloakConfig, kyselyConfig, redisConfig } from '../../config';
import { envSchema } from '../../config/env.schema';
import { AuthModule } from '../auth/auth.module';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { KyselyDatabaseModule } from '../kysely/kysely.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [keycloakConfig, appConfig, kyselyConfig, jwtConfig, redisConfig],
      cache: true,
      validate: (config) => {
        const parsed = envSchema.safeParse(config);

        if (!parsed.success) {
          const errors = parsed.error.message
            .replace('Invalid value', 'Invalid value for')
            .replace('should be', 'of type');
          throw new Error(errors);
        }

        return config;
      }
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [redisConfig.KEY],
      useFactory: async (redisConf: ConfigType<typeof redisConfig>) => ({
        store: redisStore,
        ttl: redisConf.redisTtl,
        url: redisConf.redisUrl
      }),
      isGlobal: true
    }),
    AuthModule,
    UserModule,
    KeycloakModule,
    KyselyDatabaseModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ]
})
export class AppModule {}
