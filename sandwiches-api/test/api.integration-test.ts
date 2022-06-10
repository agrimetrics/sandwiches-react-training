import * as dotenv from 'dotenv';

import chai from 'chai';
import request from 'supertest';
import express from 'express';

import { controllers } from '../app/controllers/index';

dotenv.config();

const { expect } = chai;

// NOTE: These tests spin up a lighter version of the application in the same process
// as the test runner, without all the middlewares in agrilib.
describe('Integration tests', () => {
  let app: express.Express;

  before(() => {
    app = express();
    app.use(controllers);
  });

  beforeEach(async () => {
    await request(app)
      .delete(`/sandwiches/schedule`);
  });

  describe('/status', () => {
    it('should return 200 OK', async () => {
      const res = await request(app)
        .get(`/sandwiches/status`);
      return expect(res.status).to.equal(200);
    });
  });

  describe('GET /inventory', () => {
    it('should allow get requests', async () => {
      const res = await request(app)
        .get(`/sandwiches/inventory`);
      expect(res.status).to.equal(200);
    });

    it('should return the current inventory', async () => {
      const res = await request(app)
        .get(`/sandwiches/inventory`);
      expect(res.body).to.be.an('object').with.keys(['inventory']);
    });
  });

  describe('GET /schedule', () => {
    it('should allow get requests', async () => {
      const res = await request(app)
        .get(`/sandwiches/schedule`);
      expect(res.status).to.equal(200);
    });

    it('should return empty schedule details', async () => {
      const res = await request(app)
        .get(`/sandwiches/schedule`);
      expect(res.body.schedule).to.deep.equal([
        { time: 0, task: "break" },
      ]);
    });

    it('posting should update the schedule', async () => {
      await request(app)
        .post(`/sandwiches/orders`)
        .send({ customer: 'Stavros' });

      const res = await request(app)
        .get(`/sandwiches/schedule`);
      expect(res.body.schedule).to.deep.equal([
        { time: 0, task: "make", customer: "Stavros", type: "Sandwich" },
        { time: 150, task: "serve", customer: "Stavros", type: "Sandwich" },
        { time: 210, task: "break" },
      ]);
    });
  });

  describe('DELETE /schedule', () => {
    it('should allow delete requests', async () => {
      const res = await request(app)
        .delete(`/sandwiches/schedule`);
      expect(res.status).to.equal(200);
    });

    it('deleting should clear the shedule', async () => {
      await request(app)
        .post(`/sandwiches/orders`)
        .send({ customer: 'Stavros' });

      await request(app)
        .delete(`/sandwiches/schedule`);

      const res = await request(app)
        .get(`/sandwiches/schedule`);
      expect(res.body.schedule).to.deep.equal([
        { time: 0, task: "break" },
      ]);
    });
  });

  describe('POST /sandwiches/orders', () => {
    it('should allow an order to be placed', async () => {
      const res = await request(app)
        .post(`/sandwiches/orders`)
        .send({ customer: 'Stavros' });
      expect(res.status).to.equal(200);
    });

    it('should reject an order with no customer', async () => {
      const res = await request(app)
        .post(`/sandwiches/orders`)
        .send({});
      expect(res.status).to.equal(400);
    });

    it('should allow choosing a sandwich', async () => {
      await request(app)
        .post(`/sandwiches/orders`)
        .send({ customer: 'Stavros', type: 'Bacon' });

      const res = await request(app)
        .get(`/sandwiches/schedule`);
      expect(res.body.schedule).to.deep.equal([
        { time: 0, task: "make", customer: "Stavros", type: "Bacon" },
        { time: 150, task: "serve", customer: "Stavros", type: "Bacon" },
        { time: 210, task: "break" },
      ]);
    });

    it('should reject an order with an invalid sandwich', async () => {
      const res = await request(app)
        .post(`/sandwiches/orders`)
        .send({ customer: 'Stavros', type: 'Premium' });
      expect(res.status).to.equal(400);
    });

    it('should allow ordering multiple sandwiches', async () => {
      await request(app)
        .post(`/sandwiches/orders`)
        .send({ customer: 'Stavros', type: ['Ham and cheese', 'Bacon'] });

      const res = await request(app)
        .get(`/sandwiches/schedule`);
      expect(res.body.schedule).to.deep.equal([
        { time: 0, task: "make", customer: "Stavros", type: "Ham and cheese" },
        { time: 150, task: "make", customer: "Stavros", type: "Bacon" },
        { time: 300, task: "serve", customer: "Stavros", type: ['Ham and cheese', 'Bacon'] },
        { time: 360, task: "break" },
      ]);
    });

    it('should reject an order with too many sandwiches', async () => {
      const res = await request(app)
        .post(`/sandwiches/orders`)
        .send({
          customer: 'Stavros',
          type: ['Bacon', 'Bacon', 'Bacon', 'Bacon', 'Bacon', 'Bacon'], // 5 in stock
        });
      expect(res.status).to.equal(400);
    });
  });
});

export {};
