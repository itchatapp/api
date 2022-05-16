import { RequestHandler } from 'opine';
import { ms } from 'ms';
import { GenerateBaseGuard } from '@utils'

export const rateLimit = (opts: string, prefix: string): RequestHandler => {
  const [max, interval, onlyIP] = opts.split(/\/|--/).map((s) => s.trim());

  const options = {
    max: Number(max),
    interval: ms(interval) as number,
    onlyIP: Boolean(onlyIP),
  };

  return async (req, res, next) => {
    // TODO:
    next()
  };
};

export const Limit = (x: string) => GenerateBaseGuard(() => {})