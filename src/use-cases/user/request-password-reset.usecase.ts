import crypto from 'crypto';
import UserRepository from '../../repositories/user.repository';
import { sendPasswordResetEmail } from '../../infra/email/email-service';

class RequestPasswordResetUseCase {
  async execute(email: string): Promise<void> {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      // Don't reveal that the user doesn't exist
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await UserRepository.update(user.id, {
      passwordResetToken: user.passwordResetToken,
      passwordResetExpires: user.passwordResetExpires,
    });

    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      console.error('Failed to send password reset email', error);
      // Even if the email fails, we don't want to throw an error to the user
    }
  }
}

export default new RequestPasswordResetUseCase();
