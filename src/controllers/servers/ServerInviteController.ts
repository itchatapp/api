import { Controller, Context, Next, Check, Permission } from '../Controller'
import { Invite, Member } from '../../structures'
import sql from '../../database'

export class ServerInviteController extends Controller {
  path = '/servers/:server_id/invites'

  async 'USE /'(ctx: Context, next: Next) {
    const exists = await Member.count(sql`id = ${ctx.user.id} AND server_id = ${ctx.params.server_id}`)

    if (!exists) {
      ctx.throw('UNKNOWN_SERVER')
    }

    next()
  }

  @Check({ limit: 'number|convert|min:1|max:100|default:100' }, 'query')
  'GET /'(ctx: Context): Promise<Invite[]> {
    return Invite.find(sql`server_id = ${ctx.params.server_id} LIMIT = ${Number(ctx.query.limit)}`)
  }

  'GET /:invite_code'(ctx: Context): Promise<Invite> {
    return Invite.findOne(sql`code = ${ctx.params.invite_code} AND server_id = ${ctx.params.server_id}`)
  }

  @Permission.has('INVITE_OTHERS')
  async 'POST /:channel_id'(ctx: Context): Promise<Invite> {
    const invite = Invite.from({
      inviter_id: ctx.user.id,
      ...ctx.params as any
    })

    await invite.save()

    return invite
  }
}
