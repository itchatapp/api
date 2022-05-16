import { RequestHandler } from 'opine';
import { HTTPError } from '@errors';
import { validator } from '@utils';
import { AsyncCheckFunction, SyncCheckFunction, ValidationSchema } from 'validator';
import { GenerateGuard } from '@utils';

type Schema = AsyncCheckFunction | SyncCheckFunction | ValidationSchema;
type Type = 'body' | 'params' | 'query';

export const validate = (schema: Schema, type: Type = 'body'): typeof middleware => {
  const checker = typeof schema === 'function' ? schema : validator.compile(schema);

  const middleware: RequestHandler = async (req, res, next): Promise<void> => {
    const valid = await checker(req[type]);
    if (valid !== true) throw new HTTPError('INVALID_BODY', valid);
    next();
  };

  return middleware;
};

export const Validate = (schema: Schema, type?: Type) => GenerateGuard(validate(schema, type));