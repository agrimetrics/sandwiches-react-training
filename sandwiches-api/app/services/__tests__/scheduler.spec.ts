import { expect } from 'chai';
import { Scheduler } from '../scheduler';

describe('Scheduler', () => {
  describe('placeOrder', () => {
    it('should allow adding a sandwich order', () => {
      const scheduler = new Scheduler();
      const accepted = scheduler.placeOrder({ customer: 'Stavros' });
      expect(accepted).to.be.true;
    });

    it('should allow choosing a sandwich type', () => {
      const scheduler = new Scheduler();
      const accepted = scheduler.placeOrder({ customer: 'Stavros', type: 'Bacon' });
      expect(accepted).to.be.true;
    });

    it('should allow ordering more than one sandwich type', () => {
      const scheduler = new Scheduler();
      const accepted = scheduler.placeOrder({
        customer: 'Stavros',
        type: ['Bacon', 'Ham and cheese'],
      });
      expect(accepted).to.be.true;
    });

    it('should reject an order if a sandwich is not in stock', () => {
      const scheduler = new Scheduler();
      const accepted = scheduler.placeOrder({
        customer: 'Stavros',
        type: 'Golden Sandwich',
      });
      expect(accepted).to.be.false;
    });

    it('should reject an order too many of one sandwich are ordered', () => {
      const scheduler = new Scheduler();
      const accepted = scheduler.placeOrder({
        customer: 'Stavros',
        type: ['Bacon', 'Bacon', 'Bacon', 'Bacon', 'Bacon', 'Bacon'], // 5 in stock
      });
      expect(accepted).to.be.false;
    });

    it('should reject partially valid orders', () => {
      const scheduler = new Scheduler();
      const accepted = scheduler.placeOrder({
        customer: 'Stavros',
        type: ['Bacon', 'Ham and no cheese'],
      });
      expect(accepted).to.be.false;
    });
  });

  describe('getSchedule', () => {
    it('should return only a break if there are no tasks', () => {
      const scheduler = new Scheduler();
      const schedule = scheduler.getSchedule();
      expect(schedule).to.deep.equal([
        { time: 0, task: "break" },
      ]);
    });

    it('should return two tasks for an ordered sandwich, then a break', () => {
      const scheduler = new Scheduler();
      scheduler.placeOrder({ customer: 'Stavros' });
      const schedule = scheduler.getSchedule();
      expect(schedule).to.deep.equal([
        { time: 0, task: "make", customer: "Stavros", type: 'Sandwich' },
        { time: 150, task: "serve", customer: "Stavros", type: 'Sandwich' },
        { time: 210, task: "break" },
      ]);
    });

    it('should remember the type of sandwich', () => {
      const scheduler = new Scheduler();
      scheduler.placeOrder({ customer: 'Stavros', type: 'Bacon' });
      const schedule = scheduler.getSchedule();
      expect(schedule).to.deep.equal([
        { time: 0, task: "make", customer: "Stavros", type: 'Bacon' },
        { time: 150, task: "serve", customer: "Stavros", type: 'Bacon' },
        { time: 210, task: "break" },
      ]);
    });

    it('should support multiple orders', () => {
      const scheduler = new Scheduler();
      scheduler.placeOrder({ customer: 'Stavros' });
      scheduler.placeOrder({ customer: 'Anisa', type: 'Bacon' });
      scheduler.placeOrder({ customer: 'Adeel' });
      const schedule = scheduler.getSchedule();
      expect(schedule).to.deep.equal([
        { time: 0, task: "make", customer: "Stavros", type: 'Sandwich' },
        { time: 150, task: "serve", customer: "Stavros", type: 'Sandwich' },
        { time: 210, task: "make", customer: "Anisa", type: 'Bacon' },
        { time: 360, task: "serve", customer: "Anisa", type: 'Bacon' },
        { time: 420, task: "make", customer: "Adeel", type: 'Sandwich' },
        { time: 570, task: "serve", customer: "Adeel", type: 'Sandwich' },
        { time: 630, task: "break" },
      ]);
    });

    it('should return multiple makes and one serve for multiple sandwiches', () => {
      const scheduler = new Scheduler();
      scheduler.placeOrder({
        customer: 'Stavros',
        type: ['Bacon', 'Ham and cheese'],
      });
      const schedule = scheduler.getSchedule();
      expect(schedule).to.deep.equal([
        { time: 0, task: "make", customer: "Stavros", type: 'Bacon' },
        { time: 150, task: "make", customer: "Stavros", type: 'Ham and cheese' },
        { time: 300, task: "serve", customer: "Stavros", type: ['Bacon', 'Ham and cheese'] },
        { time: 360, task: "break" },
      ]);
    });
  });

  describe('clearSchedule', () => {
    it('should clear the schedule', () => {
      const scheduler = new Scheduler();
      scheduler.placeOrder({ customer: 'Stavros' });
      scheduler.clearSchedule();
      const schedule = scheduler.getSchedule();
      expect(schedule).to.deep.equal([
        { time: 0, task: "break" },
      ]);
    });
  });
});
