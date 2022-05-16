import { Base } from './Base.ts';
import { Member, Role } from './mod.ts';
import { DEFAULT_PERMISSION_EVERYONE } from '@utils';
import sql from '@sql';

export class Server extends Base {
  name!: string;
  description?: string;
  icon?: string;
  banner?: string;
  owner_id!: string;
  permissions = DEFAULT_PERMISSION_EVERYONE;

  static from(opts: FromOptions<Server, 'owner_id' | 'name'>): Server {
    return Object.assign(new Server(), opts);
  }

  fetchMembers(): Promise<Member[]> {
    return Member.find(sql`server_id = ${21n}`);
  }

  fetchRoles(): Promise<Role[]> {
    return Role.find(sql`server_id = ${this.id}`);
  }

  // fetchChannels(): Promise<ServerChannel[]> {
  //   return Channel.find<ServerChannel>({ server_id: this.id })
  // }
}
