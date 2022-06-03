import { PendingQuery, Row, RowList } from 'postgres'
import { Snowflake } from '../utils'
import { HTTPError, APIErrors } from '../errors'
import sql, { Query } from '../database'

export abstract class Base {
  readonly id = Snowflake.generate().toString()

  get tableName(): string {
    return (this.constructor as typeof Base).tableName
  }

  static get tableName(): string {
    return `${this.name.toLowerCase()}s`
  }


  static async find<T>(
    this: (new () => T) & { tableName: string },
    query: Query,
    select?: string[],
  ): Promise<RowList<T[]>> {
    const results = await sql`SELECT ${select ? sql(select) : sql`*`} FROM ${sql(this.tableName)} WHERE ${query}`;
    return results as RowList<T[]>;
  }

  static async findOne<T>(
    this: (new () => T) & { tableName: string; find: (typeof Base)['find'] },
    query: Query,
    select?: string[],
  ): Promise<T> {
    const [item] = await this.find(sql`${query} LIMIT = 1`, select);

    if (!item) {
      const tag = `UNKNOWN_${this.name.toUpperCase()}` as keyof typeof APIErrors;
      throw new HTTPError(tag);
    }

    return item;
  }

  static async findOneById<T>(
    this: (new () => T) & { findOne: (typeof Base)['findOne'], find: (typeof Base)['find'], tableName: string },
    id: string
  ): Promise<T> {
    return this.findOne(sql`id = ${id}`)
  }

  static async count(query: Query): Promise<number> {
    const [{ count }] = await sql`SELECT COUNT(id) FROM ${sql(this.tableName)} WHERE ${query}`;
    return count;
  }

  async save(): Promise<void> {
    const [item] = await sql`INSERT INTO ${sql(this.tableName)} ${sql(this as {})} RETURNING *`;
    Object.assign(this, item);
  }

  async update(props: Partial<this>): Promise<this> {
    await sql`UPDATE ${sql(this.tableName)} SET ${sql(props as {})} WHERE id = ${this.id}`;

    Object.assign(this, props);

    return this;
  }

  delete(): Query {
    return sql`DELETE FROM ${sql(this.tableName)} WHERE id = ${this.id}`;
  }
}
