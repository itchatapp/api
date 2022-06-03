import { Base, Role } from '.'
import { validator } from '../utils'
import sql from '../database'
import config from '../config'

export const UpdateMemberSchema = validator.compile({
  nickname: `string|min:0|max:${config.limits.member.nickname}|nullable`,
  roles: 'snowflake[]|unique|optional'
})

export class Member extends Base {
  nickname?: string
  joined_at = Date.now()
  server_id!: string
  roles: string[] = []
  
  fetchRoles(): Promise<Role[]> {
    return Role.find(sql`id = ${sql(this.roles)}`);
  }

  static from(opts: FromOptions<Member, 'server_id' | 'id'>): Member {
    return Object.assign(new this(), opts)
  }
}