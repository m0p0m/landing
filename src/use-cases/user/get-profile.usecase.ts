import UserRepository from '../../repositories/user.repository';
import { IUser } from '../../entities/user.entity';

class GetProfileUseCase {
  async execute(userId: string): Promise<Partial<IUser> | null> {
    const user = await UserRepository.findById(userId);
    if (user) {
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    }
    return null;
  }
}

export default new GetProfileUseCase();
