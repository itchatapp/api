import { URLParams, Request, Response } from '@tinyhttp/app'
import { APIErrors } from 'src/errors'
import { User } from '../structures'
import { Permissions } from '../utils'

declare module '@tinyhttp/app' {
  interface Request {
    user: User
    permissions?: Permissions
  }
}

declare module '@itchatapp/controllers' {
  export class Context {
    constructor(request: Request, response: Response)
    response: Response
    request: Request
    user: User
    body: any
    query: ParsedUrlQuery
    params: URLParams
    throw(tag: keyof typeof APIErrors): void
    header(name: string): string | null
  }
}


declare global {
  type ID = string
  type Awaited<T> = T | Promise<T>
  type WithFlag<T, Flag> = T | `${T} --${Flag}`
  type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]
  type NonFunctionProperties<T> = Omit<T, FunctionPropertyNames<T>>
  type FromOptions<T, K extends keyof T> = NonFunctionProperties<Partial<T> & Required<Pick<T, K>>>
}