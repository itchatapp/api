import { Request, Response, NextFunction } from '@tinyhttp/app'
import { User } from '../structures'

interface AuthOptions {
    ignore: `/${string}`[]
}

export const auth = (options: AuthOptions) => async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (options.ignore.some((p) => req.path.includes(p))) {
        return next()
    }

    const token = req.headers['x-session-token']

    if (!token) {
        // TODO: Add missing header instead of UNAUTHORIZED
        req.throw('UNAUTHORIZED')
    }

    const user = await User.fetchByToken(token as string)

    if (!user) {
        req.throw('UNAUTHORIZED')
    }

    Object.defineProperty(req, 'user', {
        value: user
    })

    next()
}