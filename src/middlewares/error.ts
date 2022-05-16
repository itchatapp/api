import { RequestHandler } from 'opine';
import { HTTPError } from '@errors';

export const error = (): RequestHandler =>
  async (_req, res, next) => {
    try {
      next();
    } catch (err) {
      if (err instanceof HTTPError) {
        res.status = err.status
        res.json(err)
      } else {
        res.status = 502
      }
    }
  };
