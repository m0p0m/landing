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

  async findByPasswordResetToken(token: string): Promise<IUser | null> {
    return User.findOne({ passwordResetToken: token });
  }

  async findAll(): Promise<IUser[]> {
    return User.find();
  }

  async delete(id: string): Promise<void> {
    await User.findByIdAndDelete(id);
  }
}

export default new UserRepository();
