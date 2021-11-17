import { Base, Role } from '.'
import { validator } from '../utils'
import { HTTPError } from '../errors'
import { getaway } from '../getaway'
import sql from '../database'
import config from '../config'

export interface CreateMemberOptions extends Partial<Member> {
    id: ID
    server_id: ID
}

export const CreateMemberSchema = validator.compile({
    nickname: {
        type: 'string',
        min: 0,
        max: config.limits.member.nickname,
        optional: true
    },
    roles: {
        type: 'array',
        items: 'string',
        optional: true
    }
})



export class Member extends Base {
    nickname?: string
    joined_at = Date.now()
    server_id!: ID
    roles: ID[] = []

    static async onCreate(self: Member): Promise<void> {
        await getaway.subscribe(self.id, [self.server_id])
        await getaway.publish(self.server_id, 'MEMBER_JOIN_SERVER', self)
    }

    static async onUpdate(self: Member): Promise<void> {
        await getaway.publish(self.server_id, 'MEMBER_UPDATE', self)
    }

    static async onDelete(self: Member): Promise<void> {
        await getaway.publish(self.server_id, 'MEMBER_LEAVE_SERVER', { id: self.id })
    }

    fetchRoles(): Promise<Role[]> {
        return Role.find(`id IN (${this.roles})`)
    }

    static find: (statement: string, select?: (keyof Member)[], limit?: number) => Promise<Member[]>
    static from: (opts: CreateMemberOptions) => Member

    static async findOne(statement: string, select?: (keyof Member)[]): Promise<Member> {
        const result = await super.findOne(statement, select)

        if (result) return result as Member

        throw new HTTPError('UNKNOWN_MEMBER')
    }


    static async init(): Promise<void> {
        await sql`CREATE TABLE IF NOT EXISTS ${sql(this.tableName)} (
            id BIGINT PRIMARY KEY,
            joined_at TIMESTAMP DEFAULT current_timestamp,
            nickname VARCHAR(32),
            server_id BIGINT NOT NULL,
            roles JSON NOT NULL,
            FOREIGN KEY (server_id) REFERENCES servers(id)
            FOREIGN KEY (id) REFERENCES users(id)
        )`
    }
}