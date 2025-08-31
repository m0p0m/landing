import { Schema, model, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         bio:
 *           type: string
 *           description: The bio of the user
 *         avatarUrl:
 *            type: string
 *            description: The URL of the user's avatar
 *         role:
 *            type: string
 *            description: The role of the user
 *            enum: [user, organizer, admin]
 *       example:
 *         id: 60f1b1b1b1b1b1b1b1b1b1b1
 *         username: testuser
 *         email: test@test.com
 *         bio: I am a test user
 *         avatarUrl: http://example.com/avatar.png
 *         role: user
 */

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  bio?: string;
  avatarUrl?: string;
  role: 'user' | 'organizer' | 'admin';
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshTokens?: string[];
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  avatarUrl: { type: String },
  role: { type: String, enum: ['user', 'organizer', 'admin'], default: 'user' },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  refreshTokens: [{ type: String }],
});

export default model<IUser>('User', UserSchema);
