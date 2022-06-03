import { Controller, Context, Check, Next, Permission } from '../Controller'
import { Role, CreateRoleSchema, Member } from '../../structures'
import config from '../../config'
import sql from '../../database'


export class ServerRoleController extends Controller {
  path = '/servers/:server_id/roles'

  async 'USE /'(ctx: Context, next: Next) {
    const exists = await Member.count(sql`id = ${ctx.user.id} AND server_id = ${ctx.params.server_id}`)

    if (!exists) {
      ctx.throw('UNKNOWN_SERVER')
    }

    next()
  }

  'GET /'(ctx: Context): Promise<Role[]> {
    return Role.find(sql`server_id = ${ctx.params.server_id}`)
  }

  'GET /:role_id'({ params }: Context) {
    return Role.findOne(sql`id = ${params.role_id} AND server_id = ${params.server_id}`)
  }

  @Check(CreateRoleSchema)
  @Permission.has('MANAGE_ROLES')
  async 'POST /'(ctx: Context): Promise<Role> {
    const roleCount = await Role.count(sql`server_id = ${ctx.params.server_id}`)

    if (roleCount >= config.limits.server.roles) {
      ctx.throw('MAXIMUM_ROLES')
    }

    const role = Role.from({
      ...ctx.body,
      server_id: ctx.params.server_id
    })

    await role.save()

    return role
  }
}
