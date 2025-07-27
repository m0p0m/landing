import Stripe from 'stripe';
import PaymentRepository from '../../repositories/payment.repository';
import EventRepository from '../../repositories/event.repository';
import { Schema } from 'mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

class ProcessPaymentUseCase {
  async execute(
    userId: Schema.Types.ObjectId,
    eventId: string,
    paymentMethodId: string
  ): Promise<any> {
    const event = await EventRepository.findById(eventId);
    if (!event || !event.isPremium) {
      throw new Error('This is not a premium event');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Example amount
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });

    await PaymentRepository.create({
      user: userId,
      event: event.id,
      amount: paymentIntent.amount / 100,
      stripePaymentId: paymentIntent.id,
      status: paymentIntent.status,
    });

    return paymentIntent;
  }
}

export default new ProcessPaymentUseCase();
