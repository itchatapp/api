import { Base } from './Base'
import { validator } from '../utils'
import config from '../config'


export const CreateMessageSchema = validator.compile({
  content: `string|max:${config.limits.message.length}|min:1`,
  attachments: {
    type: 'array',
    items: {
      $$type: "object",
      id: 'snowflake',
      name: 'string'
    },
    max: config.limits.message.attachments
  },
  replies: {
    type: 'array',
    items: {
      $$type: "object",
      id: 'snowflake',
      mention: 'boolean'
    },
    max: config.limits.message.replies,
    unique: true
  }
})

export const UpdateMessageSchema = validator.compile({
  content: `string|max:${config.limits.message.length}|min:1`
})


export interface Embed {
  title: string
  description: string
  footer: string
}

export interface Attachment {
  id: string
  name: string
}

export interface Reply {
  id: string
  mention: boolean
}

export class Message extends Base {
  created_at = Date.now()
  edited_at?: number
  content?: string
  embeds: Embed[] = []
  attachments: Attachment[] = []
  mentions: string[] = []
  replies: Reply[] = []
  channel_id!: string
  author_id!: string

  isEmpty(): boolean {
    return !this.content?.length && !this.attachments.length
  }

  static from(opts: FromOptions<Message, 'author_id' | 'channel_id'>): Message {
    return Object.assign(new this(), opts)
  }
}
