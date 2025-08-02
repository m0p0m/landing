import { Request, Response } from 'express';
import ProcessPaymentUseCase from '../use-cases/payment/process-payment.usecase';
import GetPaymentHistoryUseCase from '../use-cases/payment/get-payment-history.usecase';
import { Schema } from 'mongoose';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

class PaymentController {
  async checkout(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { eventId } = req.body;
      const session = await ProcessPaymentUseCase.execute(
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
      const payments = await GetPaymentHistoryUseCase.execute(req.user!.id);
      return res.json(payments);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }
}

export default new PaymentController();
