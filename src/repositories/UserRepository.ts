import User, { IUser } from '../entities/User';

class UserRepository {
  async create(user: Partial<IUser>): Promise<IUser> {
    return User.create(user);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }
}

export default new UserRepository();
