import Stripe from 'stripe';
import { config } from '../config';
import Event from '../models/event.model';
import Payment, { IPayment } from '../models/payment.model';
import { Schema } from 'mongoose';
import { NotificationService } from './notification.service';

const stripe = new Stripe(config.stripe.secretKey);

export class PaymentService {
  static async createCheckoutSession(
    userId: Schema.Types.ObjectId,
    eventId: string
  ): Promise<Stripe.Checkout.Session> {
    const event = await Event.findById(eventId);
    if (!event || !event.isPremium || !event.price) {
      throw new Error('This event is not a premium event or has no price.');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: event.title,
              description: event.description,
            },
            unit_amount: event.price * 100, // Price in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${config.clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.clientUrl}/payment-cancel`,
      metadata: {
        userId: userId.toString(),
        eventId: event.id,
      },
    });

    return session;
  }

  static async handleStripeWebhook(signature: string, body: Buffer): Promise<void> {
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, config.stripe.webhookSecret);
    } catch (err) {
      throw new Error(`Webhook Error: ${(err as Error).message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, eventId } = session.metadata as { userId: string; eventId: string };
      const amount = session.amount_total ? session.amount_total / 100 : 0;

      const payment = await Payment.create({
        user: userId,
        event: eventId,
        stripePaymentId: session.payment_intent as string,
        amount: amount,
        currency: session.currency || 'usd',
        status: 'completed',
      });

      const paidEvent = await Event.findById(eventId);
      if (paidEvent) {
        await NotificationService.createNotification(
          userId as unknown as Schema.Types.ObjectId,
          `Your payment for "${paidEvent.title}" was successful.`,
          'payment',
          { eventId: paidEvent._id as Schema.Types.ObjectId, paymentId: payment._id as Schema.Types.ObjectId }
        );
      }
    }
  }

  static async getPaymentHistory(userId: string): Promise<IPayment[]> {
    return Payment.find({ user: userId }).populate('event', 'title date');
  }

  static async createRefund(paymentIntentId: string): Promise<Stripe.Refund> {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
      });

      // Update payment status in the database
      await Payment.findOneAndUpdate(
        { stripePaymentId: paymentIntentId },
        { status: 'refunded' }
      );

      return refund;
    } catch (err) {
      throw new Error(`Stripe Refund Error: ${(err as Error).message}`);
    }
  }
}
