import { RequestHandler } from 'opine';
import { HTTPError } from '@errors';
import { User } from '@structures';

interface AuthOptions {
  ignore: string[];
}

export const auth = ({ ignore }: AuthOptions): RequestHandler =>
  async (req, _res, next) => {
    if (ignore.some((p) => req.path.includes(p))) {
      return next();
    }

    const token = req.headers.get('x-session-token');

    if (!token) throw new HTTPError('MISSING_HEADER');

    const user = await User.fetchByToken(token);

    if (!user) throw new HTTPError('UNKNOWN_TOKEN');

    Object.defineProperty(req, 'user', { value: user })

    next();
  };
