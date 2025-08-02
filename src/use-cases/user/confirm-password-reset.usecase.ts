import crypto from 'crypto';
import bcrypt from 'bcrypt';
import UserRepository from '../../repositories/user.repository';
import { IUser } from '../../entities/user.entity';

class ConfirmPasswordResetUseCase {
  async execute(token: string, password: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserRepository.findByPasswordResetToken(hashedToken);

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new Error('Token is invalid or has expired');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserRepository.update(user.id, {
      password: hashedPassword,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
    });
  }
}

export default new ConfirmPasswordResetUseCase();
