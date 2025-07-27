import User, { IUser } from '../entities/user.entity';

class UserRepository {
  async create(user: Partial<IUser>): Promise<IUser> {
    return User.create(user);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, user, { new: true });
  }
}

export default new UserRepository();
