import { Base } from './Base.ts';

export interface Embed {
  title: string;
  description: string;
  footer: string;
}

export interface Attachment {
  id: string;
  name: string;
}
export interface Reply {
  id: string;
  mention: boolean;
}

export class Message extends Base {
  created_at = Date.now();
  edited_at?: number;
  content?: string;
  embeds: Embed[] = [];
  attachments: Attachment[] = [];
  mentions: string[] = [];
  replies: Reply[] = [];
  channel_id!: string;
  author_id!: string;

  isEmpty(): boolean {
    return !this.content?.length && !this.attachments.length;
  }

  static from(opts: FromOptions<Message, 'author_id' | 'channel_id'>): Message {
    return Object.assign(new this(), opts);
  }
}
