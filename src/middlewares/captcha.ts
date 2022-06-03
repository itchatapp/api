import { Request, Response, NextFunction } from '@tinyhttp/app'
import { HTTPError } from '../errors'
import fetch from 'node-fetch'
import config from '../config'
import { GenerateGuard } from '@itchatapp/controllers'

export const captcha = () => async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const key = req.body.captcha_key

  if (!key) {
    throw new HTTPError('FAILED_CAPTCHA')
  }

  const payload = {
    secret: config.captcha.token,
    response: key,
    sitekey: config.captcha.key
  }

  const response = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((res) => res.json()) as { success: boolean }

  if (!response || !response.success) {
    throw new HTTPError('FAILED_CAPTCHA')
  }

  next()
}

export const Captcha = () => GenerateGuard(captcha())