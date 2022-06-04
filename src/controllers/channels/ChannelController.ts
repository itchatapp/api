import { Controller, Context, Check, Limit } from '../Controller'
import { Channel, ChannelTypes, CreateGroupSchema, DMChannel, GroupChannel, User } from '../../structures'
import { Permissions } from '../../utils'
import config from '../../config'
import sql from '../../database'


@Limit('5/5s')
export class ChannelController extends Controller {
  path = '/channels/@me'

  'GET /'(ctx: Context): Promise<GroupChannel[] | DMChannel[]> {
    return Channel.find(sql`recipients::jsonb ? ${ctx.user.id}`) as unknown as Promise<GroupChannel[] | DMChannel[]>
  }

  'GET /:channel_id'(ctx: Context): Promise<GroupChannel | DMChannel> {
    return Channel.findOne(sql`id = ${ctx.params.channel_id} AND recipients::jsonb ? ${ctx.user.id}`) as Promise<GroupChannel>
  }

  @Check(CreateGroupSchema)
  async 'POST /'(ctx: Context): Promise<GroupChannel> {
    const groupCount = await Channel.count(sql`type = ${ChannelTypes.GROUP} AND recipients::jsonb ? ${ctx.user.id}`)

    if (groupCount >= config.limits.user.groups) {
      ctx.throw('MAXIMUM_GROUPS')
    }

    const group = Channel.from({
      type: ChannelTypes.GROUP,
      name: ctx.body.name,
      owner_id: ctx.user.id,
      recipients: [ctx.user.id]
    })

    await group.save()

    return group
  }

  async 'POST /:group_id/:user_id'(ctx: Context): Promise<GroupChannel> {
    const { user_id, group_id } = ctx.params

    const [group, target] = await Promise.all([
      Channel.findOne(sql`id = ${group_id} AND type = ${ChannelTypes.GROUP} AND recipients::jsonb ? ${ctx.user.id}`),
      User.findOne(sql`id = ${user_id}`)
    ])

    if (!group.isGroup()) {
      throw new Error('?')
    }

    if (group.recipients.length >= config.limits.group.members) {
      ctx.throw('MAXIMUM_GROUP_MEMBERS')
    }

    if (group.recipients.includes(target.id)) {
      ctx.throw('MISSING_ACCESS')
    }

    await group.update({
      recipients: [...group.recipients, target.id]
    })

    return group
  }

  async 'DELETE /:group_id/:user_id'(ctx: Context): Promise<void> {
    const { user_id, group_id } = ctx.params
    const [group, target] = await Promise.all([
      Channel.findOne(sql`id = ${group_id} AND type = ${ChannelTypes.GROUP} AND recipients::jsonb ? ${ctx.user.id}`),
      User.findOne(sql`id = ${user_id}`)
    ])

    if (!group.isGroup()) {
      throw new Error('?')
    }

    if (ctx.user.id === group.owner_id && ctx.user.id === target.id) {
      ctx.throw('MISSING_ACCESS')
    }

    if (!group.recipients.includes(target.id)) {
      ctx.throw('UNKNOWN_MEMBER')
    }

    const permissions = await Permissions.fetch({
      user: ctx.user,
      channel: group
    })

    if (!permissions.has('KICK_MEMBERS')) {
      ctx.throw('MISSING_PERMISSIONS')
    }

    await group.update({
      recipients: group.recipients.filter((id) => id !== target.id)
    })
  }

  async 'DELETE /:channel_id'(ctx: Context): Promise<void> {
    const channel = await Channel.findOne(sql`id = ${ctx.params.channel_id} AND type = ${ChannelTypes.GROUP} AND recipients::jsonb ? ${ctx.user.id}`)

    if (!channel.isGroup()) return
    if (channel.owner_id !== ctx.user.id) {
      ctx.throw('MISSING_ACCESS')
    }

    await channel.delete()
  }
}
