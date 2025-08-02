import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import { server } from '../src/infra/http/express-app';
import mongoose from 'mongoose';
import User from '../src/entities/user.entity';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Routes', () => {
  it('should register a new user', async () => {
    const res = await request(server)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should not register a user with an existing email', async () => {
    const res = await request(server)
      .post('/api/users/register')
      .send({
        username: 'testuser2',
        email: 'testuser@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should login an existing user', async () => {
    const res = await request(server)
      .post('/api/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
