import { Base, Role } from './mod.ts';
import sql from '@sql';

export class Member extends Base {
  nickname?: string;
  joined_at = Date.now();
  server_id!: string;
  roles: string[] = [];

  fetchRoles(): Promise<Role[]> {
    return Role.find(sql`id = ${sql(this.roles)}`);
  }

  static from(opts: FromOptions<Member, 'server_id' | 'id'>): Member {
    return Object.assign(new Member(), opts);
  }
}
