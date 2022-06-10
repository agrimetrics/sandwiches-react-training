import { errors } from '@agrimetrics/agrilib';
import { router as statusRouter } from './status';
import { router as sandwichesRouter } from './sandwiches';

export const controllers = [
  statusRouter,
  sandwichesRouter,
  errors.handler,
];
