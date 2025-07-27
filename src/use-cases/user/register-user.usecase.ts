import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserRepository from '../../repositories/user.repository';
import { IUser } from '../../entities/user.entity';

class RegisterUserUseCase {
  async execute(userData: Partial<IUser>): Promise<{ user: IUser; token: string }> {
    const { email, password } = userData;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserRepository.create({ ...userData, password: hashedPassword });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    return { user, token };
  }
}

export default new RegisterUserUseCase();
