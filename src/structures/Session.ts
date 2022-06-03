import { Base } from './Base'
import { nanoid } from 'nanoid'

interface DeviceInfo {
  name?: string
}

export class Session extends Base {
  readonly token = nanoid(64);
  readonly user_id!: string;
  info!: DeviceInfo;
  static from(opts: FromOptions<Session, 'user_id'>): Session {
    return Object.assign(new this(), opts);
  }
}