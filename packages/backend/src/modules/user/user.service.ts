import { Inject, Injectable } from '@nestjs/common';
import { InsertResult, Kysely, Selectable } from 'kysely';
import { DB, User } from '@/src/db/types';
import { KYSELY_DATABASE_CONNECTION } from '../kysely/constants';
import { LocalRegisterDto } from '../local-auth/dtos/register.dto';

@Injectable()
export class UserService {
  public constructor(@Inject(KYSELY_DATABASE_CONNECTION) private readonly kysely: Kysely<DB>) {}
  public async findUserByEmail(email: string): Promise<Selectable<User> | undefined> {
    return this.kysely.selectFrom('User').where('email', '=', email).selectAll().executeTakeFirst();
  }

  public async createUser(
    registerDto: LocalRegisterDto,
    keycloakUserId: string
  ): Promise<InsertResult | undefined> {
    return this.kysely
      .insertInto('User')
      .values({
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        keycloakId: keycloakUserId,
        updatedAt: new Date()
      })
      .executeTakeFirst();
  }
}
