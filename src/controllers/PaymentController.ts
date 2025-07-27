import { Request, Response } from 'express';
import ProcessPayment from '../use-cases/payment/ProcessPayment';
import GetPaymentHistory from '../use-cases/payment/GetPaymentHistory';
import { Schema } from 'mongoose';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

class PaymentController {
  async checkout(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { eventId, paymentMethodId } = req.body;
      const paymentIntent = await ProcessPayment.execute(
        req.user!.id as unknown as Schema.Types.ObjectId,
        eventId,
        paymentMethodId
      );
      return res.json(paymentIntent);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getHistory(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const payments = await GetPaymentHistory.execute(req.user!.id);
      return res.json(payments);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new PaymentController();
