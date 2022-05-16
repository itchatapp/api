import { Base } from './Base.ts';
import { nanoid } from 'nanoid';

interface DeviceInfo {
  name?: string;
}

export class Session extends Base {
  readonly token = nanoid(64);
  readonly user_id!: bigint;
  info!: DeviceInfo;
  static from(opts: FromOptions<Session, 'user_id'>): Session {
    return Object.assign(new this(), opts);
  }
}
