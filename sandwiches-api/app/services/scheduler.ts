import { checkItemStock } from './inventory';

type Order = {
  customer: string,
  type?: string | Array<string>,
}

type QualifiedOrder = {
  customer: string,
  type: Array<string>,
}

type Task = {
  task: "break" | "make" | "serve",
  type?: string | Array<string>,
  customer?: string,
};

interface ScheduleItem extends Task {
  time: number;
}

export class Scheduler {
  orders: Array<QualifiedOrder> = [];

  _orderTasks(order: QualifiedOrder): Array<Task> {
    return [
      ...order.type.map(type => ({ customer: order.customer, type, task: "make" } as Task)),
      { ...order, task: "serve" },
    ];
  }

  _breakTask(): Task {
    return { task: "break" };
  }

  _getTasks(): Array<Task> {
    const tasks: Array<Task> = [];
    this.orders.forEach(order => {
      tasks.push(...this._orderTasks(order));
    });
    tasks.push(this._breakTask());
    return tasks;
  }

  _taskTime(task: Task): number {
    const timings = {
      make: 150,
      serve: 60,
      break: 0,
    };
    return timings[task.task];
  }

  _getScheduleItem(task: Task, time: number): ScheduleItem {
    const scheduleItem = { ...task, time };
    if (scheduleItem.type && scheduleItem.type.length === 1) {
      [scheduleItem.type] = scheduleItem.type;
    }
    return scheduleItem;
  }

  placeOrder(order: Order): boolean {
    const sandwichType = order.type || 'Sandwich';
    const sandwichTypes = Array.isArray(sandwichType) ? sandwichType : [sandwichType];
    const sandwichCounts = sandwichTypes.reduce((counts, type) => {
      const newCounts = { ...counts };
      if (newCounts[type] === undefined) {
        newCounts[type] = 0;
      }
      newCounts[type] += 1;
      return newCounts;
    }, {} as Record<string, number>);
    const inStock = Object.entries(sandwichCounts).every(([type, count]) => checkItemStock(type, count));
    if (inStock) {
      this.orders.push({ ...order, type: sandwichTypes });
    }
    return inStock;
  }

  getSchedule(): Array<ScheduleItem> {
    const schedule: Array<ScheduleItem> = [];
    const tasks = this._getTasks();
    let time = 0;
    tasks.forEach(task => {
      schedule.push(this._getScheduleItem(task, time));
      time += this._taskTime(task);
    });
    return schedule;
  }

  clearSchedule(): void {
    this.orders = [];
  }
}
