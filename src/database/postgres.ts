import postgres from 'postgres';
import config from '@config';
import { Bot, Channel, Invite, Member, Message, Role, Server, Session, User } from '@structures';

export type Query<T extends postgres.Row = postgres.Row> = postgres.PendingQuery<T[]>;

const sql = postgres(config.databaseUri, {
  types: {
    bigint: postgres.BigInt,
  },
  transform: {
    undefined: null,
    row: (v: any) => {
      if ('username' in v) return User.from(v);
      if ('code' in v) return Invite.from(v);
      if ('nickname' in v) return Member.from(v);
      if ('embeds' in v) return Message.from(v);
      if ('token' in v) return Session.from(v);
      if ('type' in v) return Channel.from(v);
      if ('hoist' in v) return Role.from(v);
      if ('owner_id' in v && 'presence' in v) return Bot.from(v);
      if ('owner_id' in v) return Server.from(v);
      return v;
    },
  }
});

export default sql;
