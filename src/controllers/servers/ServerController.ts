import * as web from 'express-decorators'
import { Response, Request } from '@tinyhttp/app'
import { Server, Category, TextChannel, CreateServerSchema } from '../../structures'
import { HTTPError } from '../../errors'
import { getaway } from '../../server'
import { BASE_SERVER_PATH } from '.'
import config from '../../../config'


@web.basePath(BASE_SERVER_PATH)
export class ServerController {
    @web.post('/:serverId')
    async fetchServer(req: Request, res: Response): Promise<void> {
        if (!req.user.servers.some(id => id === req.params.serverId)) {
            throw new HTTPError('MISSING_ACCESS')
        }

        const server = await Server.findOne({
            _id: req.params.serverId,
            deleted: false
        })

        if (!server) {
            throw new HTTPError('UNKNOWN_SERVER')
        }

        res.json(server)
    }

    @web.post('/')
    async createServer(req: Request, res: Response): Promise<void> {
        req.check(CreateServerSchema)

        if (req.user.servers.length >= config.limits.user.servers) {
            throw new HTTPError('MAXIMUM_SERVERS')
        }

        const server = Server.from({
            ...req.body,
            ownerId: req.user._id
        })

        const chat = TextChannel.from({
            name: 'general',
            serverId: server._id
        })

        const category = Category.from({
            name: 'General',
            serverId: server._id,
            channels: [chat._id]
        })

        await Promise.all([server.save(), chat.save(), category.save()])
        await getaway.subscribe(req.user._id, server._id, chat._id, category._id)
        await server.addMember(req.user)

        getaway.publish(server._id, 'SERVER_CREATE', server)

        res.json(server)
    }
}