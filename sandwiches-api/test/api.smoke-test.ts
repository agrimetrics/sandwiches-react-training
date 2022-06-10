import * as dotenv from 'dotenv';

import chai from 'chai';
import chaiHttp from 'chai-http';
import { logger } from '@agrimetrics/agrilib';

dotenv.config();

const log = logger.getLogger();

chai.use(chaiHttp);
const { expect, request } = chai;

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

describe('Smoke tests', () => {
  describe('/status', () => {
    it('should return 200 OK', async () => {
      log.info(`Calling ${BASE_URL}/sandwiches/status`);
      const res = await request(BASE_URL).get(`/sandwiches/status`);
      return expect(res).to.have.status(200);
    });
  });
});

export {};
