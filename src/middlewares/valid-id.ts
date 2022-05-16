import { RequestHandler } from 'opine';
import { HTTPError } from '@errors';
import { is } from '@utils';

const ID_ENDS = '_id'

export const validId = (): RequestHandler =>
  async (req, _res, next) => {
    
    for (const key in req.params) {
      if (key.endsWith(ID_ENDS) && !is.snowflake(req.params[key])) throw new HTTPError('INVALID_ID');
    }

    next();
  };
