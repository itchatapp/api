import { Request, Response, NextFunction } from '@tinyhttp/app'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import { createRedisConnection } from '../database/redis'
import ms, { StringValue } from 'ms'
import { GenerateBaseGuard } from '@itchatapp/controllers'

const storeClient = createRedisConnection()

export const rateLimit = (opts: string, prefix: string): typeof middleware => {
  const [max, interval, onlyIP] = opts.split(/\/|--/).map(s => s.trim())

  const options = {
    max: Number(max),
    interval: ms(interval as '1'),
    onlyIP: Boolean(onlyIP)
  }

  const limiter = new RateLimiterRedis({
    storeClient,
    points: options.max,
    duration: options.interval / 1000, // Per second(s)
    keyPrefix: prefix
  })


  const middleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let limited = true

    const key = req.user && !options.onlyIP
      ? req.user.id
      : req.ip

    if (!key) {
      throw new Error(`Couldn't Get key for the following request at ${req.path}`)
    }

    const info = await limiter.consume(key).then(() => limited = false).catch(res => res)

    if (!limited) {
      return next()
    }

    if (!res.headersSent) res
      .setHeader("Retry-After", info.msBeforeNext / 1000)
      .setHeader("X-RateLimit-Limit", options.max)
      .setHeader("X-RateLimit-Remaining", info.remainingPoints)
      .setHeader("X-RateLimit-Reset", new Date(Date.now() + info.msBeforeNext).toString())


    res
      .status(429)
      .json({
        message: 'Too many requests, please try again later.',
        retry_after: info.msBeforeNext / 1000
      })
  }

  return middleware
}

export const Limit = (limit: WithFlag<`${number}/${StringValue}`, 'ip'>) => {
  return GenerateBaseGuard(rateLimit(limit, crypto.randomUUID().slice(5)))
}