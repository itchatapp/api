import Server from './server'
import { migrate } from './database'
import { logger } from './utils'
import config from './config'

export const server = new Server()


try {
  logger.log('Initialling the server...')

  await server.init({
    origin: config.endpoints.main
  })

  logger.log('Initialling the database...')

  await migrate()
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
