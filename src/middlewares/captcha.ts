import { RequestHandler } from 'opine';
import { HTTPError } from '@errors';
import { GenerateGuard } from '@utils';
import config from '@config';

export const captcha = (): RequestHandler =>
  async (req, _res, next) => {
    const key = req.headers.get('key');

    if (!key) {
      throw new HTTPError('FAILED_CAPTCHA');
    }

    const payload = {
      secret: config.captcha.token,
      response: key,
      sitekey: config.captcha.key,
    };

    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then((res) => res.json());

    if (!response?.success) {
      throw new HTTPError('FAILED_CAPTCHA');
    }

    next();
  };

export const Captcha = () => GenerateGuard(captcha());
