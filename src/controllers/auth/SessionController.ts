import { Controller, Context, Check, Limit } from '../Controller'
import { LogoutUserSchema, Session } from '../../structures'
import sql from '../../database'

@Limit('30/1h')
export class SessionController extends Controller {
  path = '/auth/sessions'

  'GET /'(ctx: Context): Promise<Session[]> {
    return Session.find(sql`user_id = ${ctx.user.id}`, ['info', 'id'])
  }

  'GET /:session_id'(ctx: Context): Promise<Session> {
    return Session.findOne(sql`id = ${ctx.params.session_id} AND user_id = ${ctx.user.id}`, ['info'])
  }

  @Check(LogoutUserSchema)
  async 'POST /logout/:session_id'(ctx: Context) {
    const session = await Session.findOne(sql`id = ${ctx.params.session_id} AND token = ${ctx.body.token}`)
    await session.delete()
  }
}
