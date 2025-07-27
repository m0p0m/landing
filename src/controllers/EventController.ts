import { Request, Response } from 'express';
import CreateEvent from '../use-cases/CreateEvent';
import GetEvents from '../use-cases/GetEvents';
import { Schema } from 'mongoose';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

class EventController {
  async create(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const event = await CreateEvent.execute(req.body, req.user!.id as unknown as Schema.Types.ObjectId);
      return res.status(201).json(event);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const events = await GetEvents.execute();
      return res.json(events);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new EventController();
