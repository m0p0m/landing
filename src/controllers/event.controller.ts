import { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { Schema } from 'mongoose';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

class EventController {
  async create(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const event = await EventService.createEvent(req.body, req.user!.id as unknown as Schema.Types.ObjectId);
      return res.status(201).json(event);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const events = await EventService.getEvents(req.query);
      return res.json(events);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async search(req: Request, res: Response): Promise<Response> {
    try {
      const { q } = req.query;
      const events = await EventService.searchEvents(q as string);
      return res.json(events);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async getEventsWithin(req: Request, res: Response): Promise<Response> {
    try {
      const { distance, latlng, unit } = req.params;
      const events = await EventService.findEventsWithin(parseFloat(distance), latlng, unit);
      return res.json(events);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const event = await EventService.getEventById(req.params.id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      return res.json(event);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const event = await EventService.updateEvent(req.params.id, req.body);
      return res.json(event);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<Response> {
    try {
      await EventService.deleteEvent(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }
}

export default new EventController();
