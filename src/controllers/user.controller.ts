import { Request, Response } from 'express';
import RegisterUserUseCase from '../use-cases/user/register-user.usecase';
import LoginUserUseCase from '../use-cases/user/login-user.usecase';
import UpdateProfileUseCase from '../use-cases/user/update-profile.usecase';
import GetProfileUseCase from '../use-cases/user/get-profile.usecase';
import RequestPasswordResetUseCase from '../use-cases/user/request-password-reset.usecase';
import ConfirmPasswordResetUseCase from '../use-cases/user/confirm-password-reset.usecase';
import GetAllUsersUseCase from '../use-cases/user/get-all-users.usecase';
import DeleteUserUseCase from '../use-cases/user/delete-user.usecase';

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

class UserController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { user, token } = await RegisterUserUseCase.execute(req.body);
      return res.status(201).json({ user, token });
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { token } = await LoginUserUseCase.execute(req.body);
      return res.json({ token });
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message });
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const user = await GetProfileUseCase.execute(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const user = await UpdateProfileUseCase.execute(req.user!.id, req.body);
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async requestPasswordReset(req: Request, res: Response): Promise<Response> {
    try {
      await RequestPasswordResetUseCase.execute(req.body.email);
      return res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async confirmPasswordReset(req: Request, res: Response): Promise<Response> {
    try {
      const { token, password } = req.body;
      await ConfirmPasswordResetUseCase.execute(token, password);
      return res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await GetAllUsersUseCase.execute();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      await DeleteUserUseCase.execute(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }
}

export default new UserController();
