import postgres from 'postgres'
import config from '../config'
import {
  Invite,
  Member,
  User,
  Message,
  Session,
  Channel,
  Role,
  Server,
  Bot
} from '../structures'

export type Query<T extends postgres.Row = postgres.Row> = postgres.PendingQuery<T[]>;


const sql = postgres(config.database.uri, {
  transform: {
    undefined: null,
    row: (x: any) => {
      if ('username' in x) return User.from(x)
      if ('code' in x) return Invite.from(x)
      if ('nickname' in x) return Member.from(x)
      if ('embeds' in x) return Message.from(x)
      if ('token' in x) return Session.from(x)
      if ('type' in x) return Channel.from(x)
      if ('hoist' in x) return Role.from(x)
      if ('owner_id' in x && 'presence' in x) return Bot.from(x)
      if ('owner_id' in x) return Server.from(x)
      return x
    }
  }
})


export default sql
