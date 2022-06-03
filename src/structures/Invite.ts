import { Base } from '.'
import { nanoid } from 'nanoid'

export class Invite extends Base {
  readonly code = nanoid(8)
  uses = 0
  inviter_id!: string
  channel_id!: string
  server_id!: string
  static from(opts: FromOptions<Invite, 'server_id' | 'channel_id' | 'inviter_id'>): Invite {
    return Object.assign(new this(), opts)
  }
}
