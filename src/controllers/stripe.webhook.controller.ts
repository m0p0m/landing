import { Request, Response } from 'express';
import Stripe from 'stripe';
import { env } from '../config/env.config';
import PaymentRepository from '../repositories/payment.repository';
import { Schema } from 'mongoose';

const stripe = new Stripe(env.stripe.secretKey, {
  apiVersion: undefined,
});

class StripeWebhookController {
  async handleWebhook(req: Request, res: Response): Promise<Response> {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, env.stripe.webhookSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, eventId } = session.metadata!;

      await PaymentRepository.create({
        user: userId as unknown as Schema.Types.ObjectId,
        event: eventId as unknown as Schema.Types.ObjectId,
        amount: session.amount_total! / 100,
        stripePaymentId: session.payment_intent as string,
        status: 'completed',
      });
    }

    return res.json({ received: true });
  }
}

export default new StripeWebhookController();
