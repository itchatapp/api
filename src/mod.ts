import { Server } from './server.ts';
import config from '@config';

const server = new Server();

try {
   await server.listen(Number(config.port));
} catch (err) {
  console.error(err);
}
