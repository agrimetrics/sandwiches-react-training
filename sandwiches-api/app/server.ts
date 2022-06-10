import * as dotenv from 'dotenv';

import config from 'config';
import { server, logger } from '@agrimetrics/agrilib';

import { name } from '../package.json';
import { controllers } from './controllers';

dotenv.config();

logger.init(config);

server.start(name, config, controllers);
