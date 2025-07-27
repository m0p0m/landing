import { Request, Response } from 'express';
import RSVPToEvent from '../use-cases/rsvp/RSVPToEvent';
import GetRSVPs from '../use-cases/rsvp/GetRSVPs';
import { Schema } from 'mongoose';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

class RSVPController {
  async create(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { status } = req.body;
      const rsvp = await RSVPToEvent.execute(
        req.user!.id as unknown as Schema.Types.ObjectId,
        req.params.id as unknown as Schema.Types.ObjectId,
        status
      );
      return res.status(201).json(rsvp);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const rsvps = await GetRSVPs.execute(req.params.id);
      return res.json(rsvps);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new RSVPController();
