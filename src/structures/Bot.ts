import { Base } from './Base.ts';
import { Presence, PresenceStatus } from './User.ts';
import { nanoid } from 'nanoid';

export class Bot extends Base {
  username!: string;
  owner_id!: string;
  avatar?: string;
  presence: Presence = { status: PresenceStatus.OFFLINE };
  verified = false;
  readonly token = nanoid(64);
  
  static from(opts: FromOptions<Bot, 'username' | 'owner_id'>): Bot {
    return Object.assign(new this(), opts);
  }
}
