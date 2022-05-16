import { Context, Controller } from '@utils';
import { Session } from '@structures';
import { Limit, Validate } from '@middlewares';
import sql from '@sql';

@Limit('30/1h')
export class SessionController extends Controller {
  path = '/auth/sessions';

  'GET /'(ctx: Context): Promise<Session[]> {
    return Session.find(sql`user_id = ${ctx.user.id}`, ['id', 'info']);
  }

  'GET /:session_id'(ctx: Context): Promise<Session> {
    return Session.findOne(sql`id = ${ctx.params.session_id} AND user_id = ${ctx.user.id}`, ['info']);
  }

  @Validate({ token: 'string', user_id: 'snowflake' })
  async 'POST /logout/:session_id'(ctx: Context) {
    const session = await Session.findOne(sql`id = ${ctx.params.session_id} AND token = ${ctx.body.token}`);
    await session.delete();
  }
}
