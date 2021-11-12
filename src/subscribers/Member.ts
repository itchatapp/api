
import { Member as T, User } from '../structures'
import { getaway } from '../getaway'

export class MemberSubscriber implements EventSubscriber<T> {
  async afterCreate({ entity: member }: EventArgs<T>): Promise<void> {
    await getaway.subscribe(member.id, [member.server.id])
    await getaway.publish(member.server.id, 'MEMBER_JOIN_SERVER', member)

    const user = await User.findOne({ id: member.id }, { populate: ['servers'] })

    if (user) {
      user.servers.add(member.server)
      await user.save()
    }
  }

  async afterDelete({ entity: member }: EventArgs<T>): Promise<void> {
    await getaway.publish(member.server.id, 'MEMBER_LEAVE_SERVER', {
      id: member.id,
      serverid: member.server.id
    })

    const user = await User.findOne({ id: member.id }, { populate: ['servers'] })

    if (user) {
      user.servers.remove(member.server)
      await user.save()
    }
  }

  async afterUpdate({ entity: member }: EventArgs<T>): Promise<void> {
    await getaway.publish(member.server.id, 'MEMBER_UPDATE', member)
  }

  getSubscribedEntities(): Array<EntityName<T>> {
    return [T]
  }
}