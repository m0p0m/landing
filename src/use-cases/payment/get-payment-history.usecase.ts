import PaymentRepository from '../../repositories/payment.repository';
import { IPayment } from '../../entities/payment.entity';

class GetPaymentHistoryUseCase {
  async execute(userId: string): Promise<IPayment[]> {
    return PaymentRepository.findByUserId(userId);
  }
}

export default new GetPaymentHistoryUseCase();
