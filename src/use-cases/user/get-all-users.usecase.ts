import UserRepository from '../../repositories/user.repository';
import { IUser } from '../../entities/user.entity';

class GetAllUsersUseCase {
  async execute(): Promise<Partial<IUser>[]> {
    const users = await UserRepository.findAll();
    return users.map(user => {
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    });
  }
}

export default new GetAllUsersUseCase();
