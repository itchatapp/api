import { RequestHandler } from 'opine';
import { GenerateGuard } from '@utils';

interface CorsOptions {
  origin: string;
  methods: string[];
  headers: string[];
  optionsSuccessStatus: number;
}

export const cors = (options: Partial<CorsOptions>): typeof middleware => {
  const {
    origin = '*',
    methods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    headers = ['content-type', 'content-length'],
    optionsSuccessStatus = 204,
  } = options;

  const middleware: RequestHandler = async (req, res, next) => {
    if (origin) res.append('Access-Control-Allow-Origin', origin);
    if (methods) res.append('Access-Control-Allow-Methods', methods.join(','));
    if (headers) res.append('Access-Control-Allow-Headers', headers.join(','));

    if (req.method === 'OPTIONS') {
      res.status = optionsSuccessStatus
      res.append('Content-Length', '0')
      res.end();
    } else {
      next();
    }
  };

  return middleware;
};

export const Cors = (options: CorsOptions) => GenerateGuard(cors(options));
