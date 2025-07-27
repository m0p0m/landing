import Payment, { IPayment } from '../entities/payment.entity';

class PaymentRepository {
  async create(payment: Partial<IPayment>): Promise<IPayment> {
    return Payment.create(payment);
  }

  async findByUserId(userId: string): Promise<IPayment[]> {
    return Payment.find({ user: userId }).populate('event', 'title');
  }
}

export default new PaymentRepository();
