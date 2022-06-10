import express from 'express';
import path from 'path';
import { middleware as openApiValidator } from 'express-openapi-validator';
import { Scheduler } from '../../services/scheduler';
import { listInventory } from '../../services/inventory';

const schedule = new Scheduler();

async function clearSchedule(req: express.Request, res: express.Response) {
  schedule.clearSchedule();
  res.json({});
}

async function getInventory(req: express.Request, res: express.Response) {
  const inventory = listInventory();
  res.json({ inventory });
}

async function getSchedule(req: express.Request, res: express.Response) {
  res.json({ schedule: schedule.getSchedule() });
}

async function placeOrder(req: express.Request, res: express.Response) {
  const success = schedule.placeOrder(req.body);
  if (success) {
    res.json({ success });
  } else {
    res.status(400).json({ success });
  }
}

export const router = express.Router();
router.use(express.json());
router.use(openApiValidator({
  apiSpec: path.join(process.cwd(), 'swagger.yaml'),
  validateRequests: true,
  validateResponses: true,
}));

router.get('/sandwiches/inventory', getInventory);
router.post('/sandwiches/orders', placeOrder);
router.get('/sandwiches/schedule', getSchedule);
router.delete('/sandwiches/schedule', clearSchedule);

type Error = {
  status?: number,
  errors?: Array<unknown>,
}

router.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.status && err.errors) {
    res.status(err.status)
      .json({ errors: err.errors });
  } else {
    next();
  }
});
