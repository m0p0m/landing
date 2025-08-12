import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User, { IUser } from '../models/user.model';
import { config } from '../config';
import { emailQueue } from '../config/bullmq.config';

export class UserService {
  static async register(userData: Partial<IUser>): Promise<{ user: Partial<IUser>; token: string }> {
    const { email, password } = userData;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ ...userData, password: hashedPassword });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    return { user: userWithoutPassword, token };
  }

  static async login(credentials: Partial<IUser>): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    const refreshToken = jwt.sign({ id: user.id }, config.jwt.secret, { expiresIn: '7d' });

    user.refreshTokens = [...(user.refreshTokens || []), refreshToken];
    await user.save();

    return { accessToken, refreshToken };
  }

  static async refresh(token: string): Promise<{ accessToken: string }> {
    const decoded = jwt.verify(token, config.jwt.secret) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user || !user.refreshTokens?.includes(token)) {
      throw new Error('Invalid refresh token');
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    return { accessToken };
  }

  static async logout(token: string): Promise<void> {
    const decoded = jwt.verify(token, config.jwt.secret) as { id: string };
    const user = await User.findById(decoded.id);

    if (user) {
      user.refreshTokens = user.refreshTokens?.filter((t) => t !== token);
      await user.save();
    }
  }

  static async getProfile(userId: string): Promise<Partial<IUser> | null> {
    const user = await User.findById(userId).select('-password');
    return user;
  }

  static async updateProfile(userId: string, profileData: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, profileData, { new: true });
  }

  static async deleteUser(userId: string): Promise<void> {
    await User.findByIdAndDelete(userId);
  }

  static async getAllUsers(): Promise<Partial<IUser>[]> {
    return User.find().select('-password');
  }

  static async requestPasswordReset(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();

    await emailQueue.add('sendPasswordReset', { to: user.email, token: resetToken });
  }

  static async resetPassword(token: string, password: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new Error('Token is invalid or has expired');
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  }
}
