import { Base, Session, Server } from '.'
import { validator } from '../utils'
import sql from '../database'
import config from '../config'
import { Bot } from './Bot'

export type PublicUser = Omit<User, 'email' | 'password' | 'relations' | 'verified'>;

export const PUBLIC_USER_PROPS: (keyof PublicUser)[] = [
  'id',
  'username',
  'presence',
  'badges',
  'avatar'
]


export interface CreateUserOptions extends Partial<User> {
  username: string
  password: string
  email: string
}

export const CreateUserSchema = validator.compile({
  $$async: true,
  username: {
    type: 'string',
    min: 3,
    max: config.limits.user.username,
    pattern: /^[a-z0-9_]+$/i,
    custom: async (value: string, errors: unknown[]) => {
      if (['system', 'admin', 'bot', 'developer', 'staff', '___'].includes(value.toLowerCase())) {
        errors.push({ type: 'unique', actual: value })
      } else {
        const exists = await User.count(sql`username = ${value}`)
        if (exists) errors.push({ type: "unique", actual: value })
      }
      return value
    }
  },
  email: {
    type: 'email',
    normalize: true,
    custom: async (value: string, errors: unknown[]) => {
      const exists = await User.count(sql`email = ${value}`)
      if (exists) errors.push({ type: "unique", actual: value })
      return value
    }
  },
  password: 'string|min:8|max:72'
})

export const LoginUserSchema = validator.compile({
  email: 'email|normalize',
  password: 'string|min:8|max:32'
})

export const LogoutUserSchema = validator.compile({
  token: 'string',
  user_id: 'string'
})

export interface Presence {
  text?: string
  status: PresenceStatus
}

export type Relationships = Record<string, RelationshipStatus>

export enum PresenceStatus {
  ONLINE,
  OFFLINE,
  IDLE,
  DND
}

export enum RelationshipStatus {
  FRIEND,
  OUTGOING,
  IN_COMING,
  BLOCKED,
  BLOCKED_BY_OTHER
}



export class User extends Base {
  username!: string;
  password!: string;
  email!: string;
  presence: Presence = { status: PresenceStatus.OFFLINE };
  relations: Record<string, RelationshipStatus> = {};
  badges = 0;
  avatar?: string;
  verified = false;

  static from(opts: FromOptions<User, 'username' | 'password' | 'email'>): User {
    return Object.assign(new this(), opts);
  }

  static fetchPublicUser(id: string): Promise<PublicUser> {
    return User.findOne(sql`id = ${id}`, PUBLIC_USER_PROPS);
  }

  static async fetchByToken(token: string): Promise<User | null> {
    const [user] = await sql<User[]>`
         SELECT *
         FROM users
         LEFT JOIN sessions
         ON sessions.user_id = users.id
         WHERE verified = TRUE 
         AND sessions.token = ${token}`;
    return user ?? null;
  }

  fetchServers(): Promise<Server[]> {
    return Server.find(sql`owner_id = ${this.id} OR id IN ( SELECT server_id FROM members WHERE id = ${this.id} )`);
  }

  fetchSessions(): Promise<Session[]> {
    return Session.find(sql`user_id = ${this.id}`);
  }

  fetchRelations(): Promise<PublicUser[]> {
    return User.find(sql`id IN ${sql(Object.keys(this.relations))}`, PUBLIC_USER_PROPS);
  }

  fetchBots(): Promise<Bot[]> {
    return Bot.find(sql`owner_id = ${this.id}`);
  }
}
