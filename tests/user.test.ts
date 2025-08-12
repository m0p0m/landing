import request from 'supertest';
import { server } from '../src/app';
import User, { IUser } from '../src/models/user.model';
import { UserService } from '../src/services/user.service';

describe('User Service', () => {
  let createdUser: Partial<IUser>;

  beforeEach(async () => {
    const userData = {
      username: 'testuser',
      email: 'test@test.com',
      password: 'password'
    };
    const { user } = await UserService.register(userData);
    createdUser = user;
  });

  it('should get a user profile', async () => {
    const profile = await UserService.getProfile(createdUser._id as string);
    expect(profile).toBeDefined();
    expect(profile!.email).toEqual(createdUser.email);
  });

  it('should return null for a non-existent user profile', async () => {
    const profile = await UserService.getProfile('60f1b1b1b1b1b1b1b1b1b1b1');
    expect(profile).toBeNull();
  });

  it('should update a user profile', async () => {
    const updatedProfile = await UserService.updateProfile(createdUser._id as string, { username: 'new_username' });
    expect(updatedProfile).toBeDefined();
    expect(updatedProfile!.username).toEqual('new_username');
  });

  it('should delete a user', async () => {
    await UserService.deleteUser(createdUser._id as string);
    const user = await User.findById(createdUser._id);
    expect(user).toBeNull();
  });

  it('should refresh an access token', async () => {
    const { refreshToken } = await UserService.login({ email: 'test@test.com', password: 'password' });
    const { accessToken } = await UserService.refresh(refreshToken);
    expect(accessToken).toBeDefined();
  });

  it('should logout a user', async () => {
    const { refreshToken } = await UserService.login({ email: 'test@test.com', password: 'password' });
    await UserService.logout(refreshToken);
    await expect(UserService.refresh(refreshToken)).rejects.toThrow('Invalid refresh token');
  });
});

describe('User Routes', () => {
  it('should register a new user via the API', async () => {
    const res = await request(server)
      .post('/api/users/register')
      .send({
        username: 'testuser_api',
        email: 'test_api@test.com',
        password: 'password'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('token');
  });
});
