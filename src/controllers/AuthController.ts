import { Request, Response } from 'express';
import RegisterUser from '../use-cases/RegisterUser';
import LoginUser from '../use-cases/LoginUser';

class AuthController {
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
}

export default new AuthController();
