import { Controller, Context } from '@utils'
import { User, Session } from '@structures'
import { hash, verify } from "argon2";
import { Validate, Captcha, Limit } from '@middlewares'
import sql from '@sql'
import config from '@config'


//@AntiProxy()
@Limit('30/1h --ip')
export class AccountController extends Controller {
  path = '/auth/accounts'

  @Captcha()
  @Validate({ email: 'email|normalize', password: 'string|min:8|max:32' })
  async 'POST /login'(ctx: Context) {
    const user = await User.findOne(sql`email = ${ctx.body.email}`)

    if (!user.verified) {
      ctx.throw('USER_NOT_VERIFIED')
    }

    if (!await verify(ctx.body.password, user.password)) {
      ctx.throw('INVALID_PASSWORD')
    }

    const session = Session.from({ user_id: user.id })

    await session.save()

    return {
      token: session.token,
      id: user.id
    }
  }

  @Captcha()
  @Validate({
    $$async: true,
    username: {
      type: 'string',
      min: 3,
      max: config.limits.user.username,
      pattern: /^[a-z0-9_]+$/i,
      custom: async (value: string, errors: unknown[]) => {
        if (['system', 'admin', 'bot', 'developer', 'staff', '___'].includes(value.toLowerCase())) {
          errors.push({ type: 'unique', actual: value })
        } else {
          const exists = await User.count(sql`username = ${value}`)
          if (exists) errors.push({ type: "unique", actual: value })
        }
        return value
      }
    },
    email: {
      type: 'email',
      normalize: true,
      custom: async (value: string, errors: unknown[]) => {
        const exists = await User.count(sql`email = ${value}`)
        if (exists) errors.push({ type: "unique", actual: value })
        return value
      }
    },
    password: 'string|min:8|max:72'
  })
  async 'POST /register'(ctx: Context) {
    const user = User.from({
      username: ctx.body.username,
      email: ctx.body.email,
      password: await hash(ctx.body.password),
      verified: !config.smtp.enabled
    })

    await user.save()

    // No email verification :(
    if (!config.smtp.enabled) {
      return 201 // Created
    }

    try {
      await email.send(user)
      return 201
    } catch (err) {
      await user.delete()
      throw err
    }
  }

  async 'GET /verify/:user_id/:code'(ctx: Context) {
    const { user_id, code } = ctx.params

    const verified = await email.verify(user_id, code)

    if (!verified) {
      ctx.throw('UNKNOWN_TOKEN')
    }

    const user = await User.findOne(sql`id = ${user_id}`)

    await user.update({ verified: true })

    ctx.response.redirect(config.endpoints.app)
  }
}
