import express from 'express';
import { hal } from '@agrimetrics/agrilib';

function createTemplate() {
  return {
    version: process.env.VERSION,
    _links: {
      self: {
        href: 'status',
      },
    },
  };
}

function _controller(req: express.Request, res: express.Response) {
  const status = createTemplate();
  res.json(hal.resolve(req, status));
}

export const router = express.Router();

router.get('/sandwiches/status', _controller);
