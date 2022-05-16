import { Base } from './Base.ts';
import { DEFAULT_PERMISSION_DM } from '@utils';

export enum ChannelTypes {
  DM,
  TEXT,
  VOICE,
  CATEGORY,
  GROUP,
}

export enum OverwriteTypes {
  ROLE,
  MEMBER,
}

export interface Overwrite {
  id: string;
  type: OverwriteTypes;
  allow: bigint;
  deny: bigint;
}

export type AnyChannel = TextChannel | DMChannel | CategoryChannel | GroupChannel;

export type ServerChannel = TextChannel | CategoryChannel; /* | VoiceChannel */

export class Channel extends Base {
  readonly type!: ChannelTypes;

  isText(): this is TextChannel {
    return this.type === ChannelTypes.TEXT;
  }

  isCategory(): this is CategoryChannel {
    return this.type === ChannelTypes.CATEGORY;
  }

  isDM(): this is DMChannel {
    return this.type === ChannelTypes.DM;
  }

  isGroup(): this is GroupChannel {
    return this.type === ChannelTypes.GROUP;
  }

  isVoice(): this is VoiceChannel {
    return this.type === ChannelTypes.VOICE;
  }

  inServer(): this is ServerChannel {
    return 'server_id' in this;
  }

  static from(opts: FromOptions<TextChannel, 'type' | 'name' | 'server_id'>): TextChannel;
  static from(opts: FromOptions<DMChannel, 'type' | 'recipients'>): DMChannel;
  static from(opts: FromOptions<CategoryChannel, 'type' | 'name' | 'server_id'>): CategoryChannel;
  static from(opts: FromOptions<GroupChannel, 'type' | 'name' | 'recipients' | 'owner_id'>): GroupChannel;
  /* static from(opts: CreateVoiceChannelOptions): VoiceChannel */
  static from(opts: { type: ChannelTypes } & Partial<AnyChannel>): AnyChannel {
    let channel: AnyChannel;

    switch (opts.type) {
      case ChannelTypes.TEXT:
        channel = new TextChannel();
        break;
      case ChannelTypes.DM:
        channel = new DMChannel();
        break;
      case ChannelTypes.GROUP:
        channel = new GroupChannel();
        break;
      case ChannelTypes.CATEGORY:
        channel = new CategoryChannel();
        break;
      // case ChannelTypes.VOICE: channel = new VoiceChannel()
      //   break
      default:
        throw new Error('Unknown channel type');
    }

    return Object.assign(channel, opts);
  }
}

export class DMChannel extends Channel {
  readonly type = ChannelTypes.DM;
  recipients: string[] = [];
}

export class GroupChannel extends Channel {
  readonly type = ChannelTypes.GROUP;
  name!: string;
  owner_id!: string;
  permissions = DEFAULT_PERMISSION_DM;
  recipients: string[] = [];
}

export class TextChannel extends Channel {
  readonly type = ChannelTypes.TEXT;
  name!: string;
  server_id!: string;
  overwrites: Overwrite[] = [];
  parent_id?: string;
}

export class CategoryChannel extends Channel {
  readonly type = ChannelTypes.CATEGORY;
  name!: string;
  server_id!: string;
  overwrites: Overwrite[] = [];
}

export class VoiceChannel extends Channel {
  readonly type = ChannelTypes.VOICE;
  name!: string;
  // TODO: Add other stuff...
}
