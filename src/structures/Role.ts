import { Base } from './Base.ts';

export class Role extends Base {
  name!: string;
  permissions = 0n;
  color = 0;
  hoist = false;
  server_id!: string;

  static from(opts: FromOptions<Role, 'name' | 'server_id'>): Role {
    return Object.assign(new Role(), opts);
  }
}
