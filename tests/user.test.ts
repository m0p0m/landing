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
  beforeEach(async () => {
    await User.deleteMany({});
  });

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
    // First, register a user
    await request(server)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      });

    // Then, try to register another user with the same email
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
    // First, register a user
    await request(server)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      });

    // Then, login as that user
    const res = await request(server)
      .post('/api/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not register a user without a username', async () => {
    const res = await request(server)
      .post('/api/users/register')
      .send({
        email: 'nousername@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors[0].msg).toBe('Username is required');
  });
});
