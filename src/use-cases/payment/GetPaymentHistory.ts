import PaymentRepository from '../../repositories/PaymentRepository';
import { IPayment } from '../../entities/Payment';

class GetPaymentHistory {
  async execute(userId: string): Promise<IPayment[]> {
    return PaymentRepository.findByUserId(userId);
  }
}

export default new GetPaymentHistory();
