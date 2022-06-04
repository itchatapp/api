import { Controller, Context, Check, Permission, Next } from '../Controller'
import { Channel, CreateServerChannelSchema, ChannelTypes, Member, ServerChannel } from '../../structures'
import config from '../../config'
import sql from '../../database'


export class ServerChannelController extends Controller {
  path = '/channels/:server_id'

  async 'USE /'(ctx: Context, next: Next) {
    const exists = await Member.count(sql`id = ${ctx.user.id} AND server_id = ${ctx.params.server_id}`)

    if (!exists) {
      ctx.throw('UNKNOWN_SERVER')
    }

    next()
  }

  'GET /'(ctx: Context): Promise<ServerChannel[]> {
    return Channel.find(sql`server_id = ${ctx.params.server_id}`) as unknown as Promise<ServerChannel[]>
  }

  'GET /:channel_id'(ctx: Context): Promise<ServerChannel> {
    return Channel.findOne(sql`id = ${ctx.params.channel_id} AND server_id = ${ctx.params.server_id}`) as Promise<ServerChannel>
  }


  @Check(CreateServerChannelSchema)
  @Permission.has('MANAGE_CHANNELS')
  async 'POST /'(ctx: Context): Promise<ServerChannel> {
    const server_id = ctx.params.server_id
    const channelCount = await Channel.count(sql`server_id = ${server_id}`)

    if (channelCount >= config.limits.server.channels) {
      ctx.throw('MAXIMUM_CHANNELS')
    }

    let channel!: Channel

    switch (ctx.body.type as ChannelTypes) {
      case ChannelTypes.TEXT:
        channel = Channel.from({
          ...ctx.body,
          type: ChannelTypes.TEXT,
          server_id: server_id,
        })
        break
      case ChannelTypes.CATEGORY:
        channel = Channel.from({
          ...ctx.body,
          type: ChannelTypes.CATEGORY,
          server_id: server_id
        })
        break
      default:
        ctx.throw('INVALID_CHANNEL_TYPE')
    }

    await channel.save()

    return channel as ServerChannel
  }


  @Permission.has('MANAGE_CHANNELS')
  async 'DELETE /:channel_id'(ctx: Context): Promise<void> {
    const channel = await Channel.findOne(sql`id = ${ctx.params.channel_id} AND server_id = ${ctx.params.server_id}`)
    await channel.delete()
  }
}
