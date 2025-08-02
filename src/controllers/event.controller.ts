import { Request, Response } from 'express';
import CreateEventUseCase from '../use-cases/event/create-event.usecase';
import GetEventsUseCase from '../use-cases/event/get-events.usecase';
import UpdateEventUseCase from '../use-cases/event/update-event.usecase';
import DeleteEventUseCase from '../use-cases/event/delete-event.usecase';
import SearchEventsUseCase from '../use-cases/event/search-events.usecase';
import EventRepository from '../repositories/event.repository';
import { Schema } from 'mongoose';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

class EventController {
  async create(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const event = await CreateEventUseCase.execute(req.body, req.user!.id as unknown as Schema.Types.ObjectId);
      return res.status(201).json(event);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const options = {
        skip: (Number(page) - 1) * Number(limit),
        limit: Number(limit),
      };
      const events = await GetEventsUseCase.execute(filters, options);
      return res.json(events);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async search(req: Request, res: Response): Promise<Response> {
    try {
      const { query } = req.query;
      const events = await SearchEventsUseCase.execute(query as string);
      return res.json(events);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
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
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const event = await UpdateEventUseCase.execute(req.params.id, req.body);
      return res.json(event);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<Response> {
    try {
      await DeleteEventUseCase.execute(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }
}

export default new EventController();
