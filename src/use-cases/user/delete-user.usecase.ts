import UserRepository from '../../repositories/user.repository';

class DeleteUserUseCase {
  async execute(userId: string): Promise<void> {
    await UserRepository.delete(userId);
  }
}

export default new DeleteUserUseCase();
