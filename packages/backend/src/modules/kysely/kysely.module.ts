import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB } from '@/src/db/types';
import { kyselyConfig } from '../../config/kysely/kysely.config';
import { KYSELY_DATABASE_CONNECTION } from './constants';

@Global()
@Module({
  providers: [
    {
      provide: KYSELY_DATABASE_CONNECTION,
      inject: [kyselyConfig.KEY],
      useFactory: (databaseOptions: ConfigType<typeof kyselyConfig>) => {
        const dialect = new PostgresDialect({
          pool: new Pool({
            connectionString: databaseOptions.database_url
          })
        });

        return new Kysely<DB>({ dialect });
      }
    }
  ],
  exports: [KYSELY_DATABASE_CONNECTION]
})
export class KyselyDatabaseModule {}
