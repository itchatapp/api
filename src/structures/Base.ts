// deno-lint-ignore-file no-explicit-any
import { Snowflake } from '../utils'
import sql from '../database'

export abstract class Base {
  readonly id = Snowflake.generate()

  static async onUpdate(_self: unknown): Promise<void> {
    console.warn(`Unhandled method at ${this.tableName}`)
  }

  static async onCreate(_self: unknown): Promise<void> {
    console.warn(`Unhandled method at ${this.tableName}`)
  }

  static async onDelete(_self: unknown): Promise<void> {
    console.warn(`Unhandled method at ${this.tableName}`)
  }

  get tableName(): string {
    return `${this.constructor.name.toLowerCase()}s`
  }

  static get tableName(): string {
    return `${this.name.toLowerCase()}s`
  }

  static from(opts: unknown): unknown {
    const Class = this as unknown as new () => unknown
    return Object.assign(new Class(), opts)
  }

  static async count(statement: string): Promise<number> {
    const result = await sql`SELECT * FROM ${sql(this.tableName)} WHERE ${statement} LIMIT = 1000`
    return result.count
  }

  static async findOne(statement: string, select: string[] = ['*']): Promise<unknown | null> {
    const [data]: [unknown?] = await sql`SELECT ${sql(select)} FROM ${sql(this.tableName)} WHERE ${statement}`

    if (!data) return null

    return this.from(data)
  }

  static async find(statement: string, select: string[] = ['*'], limit = 100): Promise<unknown[]> {
    const data = await sql<unknown[]>`SELECT ${sql(select)} FROM ${sql(this.tableName)} WHERE ${statement} LIMIT ${limit}`
    return data.map(this.from)
  }

  async save(): Promise<void> {
    await sql`INSERT INTO ${sql(this.tableName)} ${sql(this)} RETURNING *`
    void (this.constructor as any).onCreate(this)
  }

  async update(props: Partial<this>): Promise<this> {
    const [data] = await sql<unknown[]>`UPDATE ${sql(this.tableName)} SET ${sql(props)} WHERE id = ${this.id} RETURNING *`

    void (this.constructor as any).onUpdate(this)

    return Object.assign(this, data)
  }

  async delete(): Promise<void> {
    await sql`DELETE FROM ${sql(this.tableName)} WHERE id = ${this.id}`
    void (this.constructor as any).onDelete(this)
  }
}