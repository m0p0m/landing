import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { config } from '../config';

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

class UserController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { user, token } = await UserService.register(req.body);
      return res.status(201).json({ user, token });
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { accessToken, refreshToken } = await UserService.login(req.body);
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: config.nodeEnv === 'production' });
      return res.json({ accessToken });
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message });
    }
  }

  async refresh(req: Request, res: Response): Promise<Response> {
    try {
      const { refreshToken } = req.cookies;
      const { accessToken } = await UserService.refresh(refreshToken);
      return res.json({ accessToken });
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message });
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    try {
      const { refreshToken } = req.cookies;
      await UserService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const user = await UserService.getProfile(req.user!.id);
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
      const user = await UserService.updateProfile(req.user!.id, req.body);
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async requestPasswordReset(req: Request, res: Response): Promise<Response> {
    try {
      await UserService.requestPasswordReset(req.body.email);
      return res.status(200).json({ message: 'Password reset request sent' });
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async confirmPasswordReset(req: Request, res: Response): Promise<Response> {
    try {
      const { token, password } = req.body;
      await UserService.resetPassword(token, password);
      return res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await UserService.getAllUsers();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      await UserService.deleteUser(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }
}

export default new UserController();
