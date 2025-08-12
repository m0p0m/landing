import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { Schema } from 'mongoose';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

class PaymentController {
  async checkout(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { eventId } = req.body;
      const session = await PaymentService.createCheckoutSession(
        req.user!.id as unknown as Schema.Types.ObjectId,
        eventId
      );
      return res.json({ url: session.url });
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async getHistory(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const payments = await PaymentService.getPaymentHistory(req.user!.id);
      return res.json(payments);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async refund(req: Request, res: Response): Promise<Response> {
    try {
      const { paymentIntentId } = req.body;
      const refund = await PaymentService.createRefund(paymentIntentId);
      return res.json(refund);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }
}

export default new PaymentController();
