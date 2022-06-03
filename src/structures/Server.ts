import { Base, Role, Channel, Member, ServerChannel } from '.'
import { DEFAULT_PERMISSION_EVERYONE, validator } from '../utils'
import sql from '../database'
import config from '../config'

export const CreateServerSchema = validator.compile({
  name: `string|min:1|max:${config.limits.server.name}`
})

export const UpdateServerSchema = validator.compile({
  name: `string|min:1|max:${config.limits.server.name}|optional`,
  description: `string|min:0|max:${config.limits.server.description}|optional`
})

export class Server extends Base {
  name!: string;
  description?: string;
  icon?: string;
  banner?: string;
  owner_id!: string;
  permissions = DEFAULT_PERMISSION_EVERYONE;

  static from(opts: FromOptions<Server, 'owner_id' | 'name'>): Server {
    return Object.assign(new this(), opts);
  }

  fetchMembers(): Promise<Member[]> {
    return Member.find(sql`server_id = ${this.id}`);
  }

  fetchRoles(): Promise<Role[]> {
    return Role.find(sql`server_id = ${this.id}`);
  }

  fetchChannels(): Promise<ServerChannel[]> {
    return Channel.find(sql`server_id = ${this.id}`) as unknown as Promise<ServerChannel[]>
  }
}
