import { Controller, Context, Check, Limit } from '../Controller'
import { Server, Channel, CreateServerSchema, Member, ChannelTypes } from '../../structures'
import config from '../../config'
import sql from '../../database'

@Limit('5/5s')
export class ServerController extends Controller {
  path = '/servers'

  'GET /'(ctx: Context): Promise<Server[]> {
    return ctx.user.fetchServers()
  }

  'GET /:server_id'(ctx: Context): Promise<Server> {
    return Server.findOne(sql`id = ${ctx.params.server_id}`)
  }

  async 'DELETE /:server_id'(ctx: Context) {
    const server = await Server.findOne(sql`id = ${ctx.params.server_id}`)

    if (ctx.user.id === server.owner_id) {
      await server.delete()
    } else {
      const member = await Member.findOne(sql`id = ${ctx.user.id} AND server_id = ${server.id}`)
      await member.delete()
    }
  }

  @Check(CreateServerSchema)
  async 'POST /'(ctx: Context): Promise<Server> {
    const serverCount = await Member.count(sql`id = ${ctx.user.id}`)

    if (serverCount >= config.limits.user.servers) {
      ctx.throw('MAXIMUM_SERVERS')
    }

    const server = Server.from({
      ...ctx.body,
      owner_id: ctx.user.id
    })

    const category = Channel.from({
      type: ChannelTypes.CATEGORY,
      server_id: server.id,
      name: 'General'
    })

    const chat = Channel.from({
      type: ChannelTypes.TEXT,
      server_id: server.id,
      name: 'general',
      parent_id: category.id
    })

    const member = Member.from({
      id: ctx.user.id,
      server_id: server.id
    })

    // FIXME: Remove "as any"
    await sql.begin((sql) => [
      sql`INSERT INTO ${sql(Server.tableName)} ${sql(server as any)}`,
      sql`INSERT INTO ${sql(Channel.tableName)} ${sql(chat as any)}`,
      sql`INSERT INTO ${sql(Channel.tableName)} ${sql(category as any)}`,
      sql`INSERT INTO ${sql(Member.tableName)} ${sql(member as any)}`,
    ])

    return server
  }
}
