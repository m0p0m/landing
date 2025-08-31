import { Queue, Worker } from 'bullmq';
import { config } from './index';

const connection = {
  host: new URL(config.redis.url).hostname,
  port: parseInt(new URL(config.redis.url).port),
};

export const emailQueue = new Queue('email', { connection });
export const eventReminderQueue = new Queue('event-reminder', { connection });

export const createWorker = (name: string, processor: (job: any) => Promise<any>) => {
  return new Worker(name, processor, { connection });
};
