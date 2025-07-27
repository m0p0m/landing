import { Request, Response } from 'express';
import CreateRSVP from '../use-cases/CreateRSVP';
import { Schema } from 'mongoose';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

class RSVPController {
  async create(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { eventId, status } = req.body;
      const rsvp = await CreateRSVP.execute(
        req.user!.id as unknown as Schema.Types.ObjectId,
        eventId,
        status
      );
      return res.status(201).json(rsvp);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new RSVPController();
