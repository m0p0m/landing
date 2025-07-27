import { Request, Response } from 'express';
import RegisterUser from '../use-cases/user/RegisterUser';
import LoginUser from '../use-cases/user/LoginUser';
import UpdateProfile from '../use-cases/user/UpdateProfile';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

class UserController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { user, token } = await RegisterUser.execute(req.body);
      return res.status(201).json({ user, token });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { token } = await LoginUser.execute(req.body);
      return res.json({ token });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<Response> {
    // This would be implemented to fetch the user's profile
    return res.json(req.user);
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const user = await UpdateProfile.execute(req.user!.id, req.body);
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new UserController();
