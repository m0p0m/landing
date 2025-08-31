import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';

class StripeWebhookController {
  async handleWebhook(req: Request, res: Response): Promise<Response> {
    const sig = req.headers['stripe-signature'] as string;

    try {
      await PaymentService.handleStripeWebhook(sig, req.body);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    return res.json({ received: true });
  }
}

export default new StripeWebhookController();
