// Mock implementation for password reset
class ResetPasswordUseCase {
  async execute(email: string): Promise<void> {
    console.log(`Password reset email sent to ${email}`);
  }
}

export default new ResetPasswordUseCase();
