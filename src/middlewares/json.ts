import { json as Json, RequestHandler } from 'opine'

export const json = (): RequestHandler => Json()