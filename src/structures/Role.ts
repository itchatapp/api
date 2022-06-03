import { Base } from '.'
import { validator } from '../utils'

export const CreateRoleSchema = validator.compile({
  name: 'string|min:1|max:32',
  color: 'number|optional',
  permissions: 'number|optional',
  hoist: 'boolean|optional'
})

export class Role extends Base {
  name!: string
  permissions = 0
  color = 0
  hoist = false
  server_id!: string
  static from(opts: FromOptions<Role, 'name' | 'server_id'>): Role {
    return Object.assign(new this(), opts)
  }
}
