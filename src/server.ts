import { opine as createHTTPServer } from 'opine'
import * as middlewares from './middlewares/mod.ts';
import * as controllers from './controllers/mod.ts'

export class Server {
  http = createHTTPServer()

  constructor() {
    this.http
      .use(middlewares.error())
      .use(middlewares.cors({
        methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
        headers: ['content-type', 'content-length', 'x-session-token'],
      }))
      .use('/auth', middlewares.cors({ methods: ['GET', 'POST'] }))
      .use(middlewares.json())
      .use(middlewares.auth({ ignore: ['/auth/accounts', '/ping'] }))
      .use(middlewares.validId())

      for (const Controller of Object.values(controllers)) new Controller().mount(this.http)
  }

  listen(port: number): Promise<void> {
    return new Promise(r => this.http.listen(port, r))
  }
}
