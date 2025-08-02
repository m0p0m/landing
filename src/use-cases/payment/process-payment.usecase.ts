import Stripe from 'stripe';
import { env } from '../../config/env.config';
import EventRepository from '../../repositories/event.repository';
import { Schema } from 'mongoose';

const stripe = new Stripe(env.stripe.secretKey, {
  apiVersion: undefined,
});

class ProcessPaymentUseCase {
  async execute(
    userId: Schema.Types.ObjectId,
    eventId: string
  ): Promise<Stripe.Checkout.Session> {
    const event = await EventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: event.title,
            },
            unit_amount: event.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${env.clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.clientUrl}/payment-cancel`,
      metadata: {
        userId: userId.toString(),
        eventId: eventId,
      },
    });

    return session;
  }
}

export default new ProcessPaymentUseCase();
