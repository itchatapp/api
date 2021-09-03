import { Entity, Property, wrap, FindOptions, FilterQuery, FindOneOptions } from 'mikro-orm'
import { Base, Presence, Session } from '.'
import { Snowflake, validator } from '../utils'
import db from '../database'

export enum RelationshipStatus {
    FRIEND,
    OUTGOING,
    IN_COMING,
    BLOCKED,
    BLOCKED_OTHER
}

export enum UserBadges {
    DEVELOPER,
    TRANSLATOR,
    SUPPORTER
}


export interface CreateUserOptions extends Partial<User> {
    username: string
    password: string
    email: string
}

export const CreateUserSchema = validator.compile({
    username: { type: 'string', min: 3, max: 32 },
    email: { type: 'string', min: 3, max: 320 },
    password: { type: 'string', min: 8, max: 72 }
})

export const LoginUserSchema = validator.compile({
    email: { type: 'string', min: 3, max: 320 },
    password: { type: 'string', min: 8, max: 72 }
})

export const LogoutUserSchema = validator.compile({
    token: { type: 'string' },
    userId: { type: 'string' }
})

@Entity({ tableName: 'users' })
export class User extends Base {
    @Property({ unique: true })
    username!: string

    @Property()
    password!: string

    @Property({ unique: true })
    email!: string

    @Property()
    presence = Presence.from({})

    @Property()
    badges = 0

    @Property()
    relations = new Map<Snowflake, RelationshipStatus>()

    @Property()
    servers: Snowflake[] = []

    @Property({ nullable: true })
    avatar?: string

    @Property()
    sessions: Session[] = []

    @Property()
    verified = false

    static from(options: CreateUserOptions): User {
        return wrap(new User().setID()).assign(options)
    }

    static find(query: FilterQuery<User>, options?: FindOptions<User>): Promise<User[]> {
        return db.get(User).find(query, options)
    }

    static findOne(query: FilterQuery<User>, options?: FindOneOptions<User>): Promise<User | null> {
        return db.get(User).findOne(query, options)
    }

    static count(query: FilterQuery<User>): Promise<number> {
        return db.get(User).count(query)
    }

    static remove(user: User): Promise<void> {
        return db.get(User).removeAndFlush(user)
    }

    static async save(...users: User[]): Promise<void> {
        await db.get(User).persistAndFlush(users)
    }

    async save(options?: Partial<User>): Promise<this> {
        await User.save(options ? wrap(this).assign(options) : this)
        return this
    }
}
