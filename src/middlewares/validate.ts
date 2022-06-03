import { CheckError } from '../errors'
import { Request, Response, NextFunction } from "@tinyhttp/app"
import { validator } from '../utils'
import { AsyncCheckFunction, SyncCheckFunction, ValidationSchema } from "fastest-validator"
import { GenerateGuard } from '@itchatapp/controllers'
import { json } from './json'

export const validate = (schema: AsyncCheckFunction | SyncCheckFunction | ValidationSchema, type: 'body' | 'params' | 'query' = 'body'): typeof middleware => {
  const checker = typeof schema === 'function' ? schema : validator.compile(schema)

  const middleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (type === 'body') await json({ limit: 102400 })(req, res, next)
    
    const valid = await checker(req[type])

    if (valid !== true) throw new CheckError(valid)

    next()
  }

  return middleware
}

export const Check = (...args: Parameters<typeof validate>) => GenerateGuard(validate(...args))