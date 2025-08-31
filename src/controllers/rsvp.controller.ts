import { Request, Response } from 'express';
import { RsvpService } from '../services/rsvp.service';
import { Schema } from 'mongoose';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

class RSVPController {
  async create(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { status } = req.body; // status should be 'attending' or 'cancelled'
      const rsvp = await RsvpService.createOrUpdateRsvp(
        req.user!.id as unknown as Schema.Types.ObjectId,
        req.params.id as unknown as Schema.Types.ObjectId,
        status
      );

      // If a user cancels, check if someone from waitlist can be promoted
      if (status === 'cancelled') {
        await RsvpService.promoteFromWaitlist(req.params.id);
      }

      // Notify clients about the new RSVP
      req.io.to(req.params.id).emit('rsvpUpdate', rsvp);

      return res.status(201).json(rsvp);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const rsvps = await RsvpService.getRsvpsForEvent(req.params.id);
      return res.json(rsvps);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async confirm(req: Request, res: Response): Promise<Response> {
    try {
      const rsvp = await RsvpService.confirmAttendance(req.params.rsvpId);
      return res.json(rsvp);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }
}

export default new RSVPController();
