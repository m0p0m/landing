import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { createClient } from 'redis';
import { config } from '../config';

const redisClient = createClient({ url: config.redis.url });

const limiterOptions = {
  storeClient: redisClient,
  keyPrefix: 'rate-limiter',
  points: 10, // 10 requests
  duration: 1, // per 1 second by IP
};

const rateLimiter = new RateLimiterRedis(limiterOptions);

export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.ip) {
    return res.status(400).send('IP address not available');
  }
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send('Too Many Requests');
    });
};
