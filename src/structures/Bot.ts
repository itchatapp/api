import { Base, Presence, PresenceStatus } from '.'
import { validator } from '../utils'

export const CreateBotSchema = validator.compile({
  username: 'string'
})

export class Bot extends Base {
  username!: string
  owner_id!: string
  avatar?: string
  presence: Presence = { status: PresenceStatus.OFFLINE }
  verified = false
  static from(opts: FromOptions<Bot, 'username' | 'owner_id'>): Bot {
    return Object.assign(new this(), opts)
  }
}