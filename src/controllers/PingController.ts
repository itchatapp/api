import { Controller } from './Controller'

export class PingController extends Controller {
    async 'GET /'(): Promise<string> {
      return `Pong! ${process.uptime()}`
    }
}