import UserRepository from '../../repositories/UserRepository';
import { IUser } from '../../entities/User';

class UpdateProfile {
  async execute(userId: string, profileData: Partial<IUser>): Promise<IUser | null> {
    return UserRepository.update(userId, profileData);
  }
}

export default new UpdateProfile();
