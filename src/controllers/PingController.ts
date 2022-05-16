import { Controller } from '@utils'

export class PingController extends Controller {
    path = '/ping'

    'GET /'(): string {
      return 'Pong!'
    }
}