import { Request, Response } from 'express';
import CreateEvent from '../use-cases/event/CreateEvent';
import GetEvents from '../use-cases/event/GetEvents';
import UpdateEvent from '../use-cases/event/UpdateEvent';
import DeleteEvent from '../use-cases/event/DeleteEvent';
import EventRepository from '../repositories/EventRepository';
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
      const { page = 1, limit = 10, ...filters } = req.query;
      const options = {
        skip: (Number(page) - 1) * Number(limit),
        limit: Number(limit),
      };
      const events = await GetEvents.execute(filters, options);
      return res.json(events);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const event = await EventRepository.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      return res.json(event);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const event = await UpdateEvent.execute(req.params.id, req.body);
      return res.json(event);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<Response> {
    try {
      await DeleteEvent.execute(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new EventController();
