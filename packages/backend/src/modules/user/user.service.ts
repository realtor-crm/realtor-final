import { Inject, Injectable } from '@nestjs/common';
import { Kysely, Selectable } from 'kysely';
import { DB, User } from '@/src/db/types';
import { KYSELY_DATABASE_CONNECTION } from '../kysely/constants';

@Injectable()
export class UserService {
  public constructor(@Inject(KYSELY_DATABASE_CONNECTION) private readonly kysely: Kysely<DB>) {}
  public async findUserByEmail(email: string): Promise<Selectable<User> | undefined> {
    return this.kysely.selectFrom('User').where('email', '=', email).selectAll().executeTakeFirst();
  }
}
