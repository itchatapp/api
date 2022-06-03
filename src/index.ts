import Server from './server'
import { logger } from './utils'
import config from './config'
import migrate from '@itchatapp/migrations'
import sql from './database'
import { join } from 'node:path'

export const server = new Server()


try {
  logger.log('Initialling the server...')

  await server.init({
    origin: config.endpoints.main
  })

  logger.log('Initialling the database...')
  await migrate({ sql, path: join(process.cwd(), 'migrations') })

  await server.listen(config.port)
  logger.log('Server running on port:', config.port)
} catch (err) {  
  logger
    .error('Failed to start the server....')
    .error(err)
    .error('Exiting...')
  process.exit(-1)
}

process
  .on('unhandledRejection', logger.error)
  .on('uncaughtException', logger.error)
