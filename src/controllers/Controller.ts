import { Context } from '@itchatapp/controllers'
import { HTTPError, APIErrors } from '../errors'

Object.defineProperties(Context.prototype, {
  user: {
    get() { return this.request.user }
  },
  throw: { 
    value: (tag: keyof typeof APIErrors) => {
      throw new HTTPError(tag)
    }
  },
  header: {
    value: function (name: string) {
      return this.request.headers[name]?.toString() ?? null
    }
  }
})

export { Context, Controller } from '@itchatapp/controllers'
export { NextFunction as Next } from '@tinyhttp/app'
export * from '../middlewares'