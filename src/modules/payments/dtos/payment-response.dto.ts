import { PaymentProvider } from '../../../common/enums/payment-provider.enum';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';

export class PaymentResponseDto {
  id: number;
  orderId: number;

  provider: PaymentProvider;
  transactionId?: string;
  status: PaymentStatus;

  createdAt: Date;
}
