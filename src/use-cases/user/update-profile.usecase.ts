import UserRepository from '../../repositories/user.repository';
import { IUser } from '../../entities/user.entity';

class UpdateProfileUseCase {
  async execute(userId: string, profileData: Partial<IUser>): Promise<IUser | null> {
    return UserRepository.update(userId, profileData);
  }
}

export default new UpdateProfileUseCase();
