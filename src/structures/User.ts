import { Base } from './Base.ts';
import { Bot, Server, Session } from './mod.ts';
import sql from '@sql';

export type PublicUser = Omit<User, 'email' | 'password' | 'relations' | 'verified'>;

export const PUBLIC_USER_PROPS: (keyof PublicUser)[] = [
  'id',
  'username',
  'presence',
  'badges',
  'avatar',
];

export type Relationships = Record<string, RelationshipStatus>;

export enum PresenceStatus {
  ONLINE,
  OFFLINE,
  IDLE,
  DND,
}

export enum RelationshipStatus {
  FRIEND,
  OUTGOING,
  IN_COMING,
  BLOCKED,
  BLOCKED_BY_OTHER,
}

export interface Presence {
  text?: string;
  status: PresenceStatus;
}

export class User extends Base {
  username!: string;
  password!: string;
  email!: string;
  presence: Presence = { status: PresenceStatus.OFFLINE };
  relations: Record<string, RelationshipStatus> = {};
  badges = 0n;
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
