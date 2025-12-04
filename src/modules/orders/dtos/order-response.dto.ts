import { OrderItemResponseDto } from './order-item-response.dto';
import { OrderStatus } from '../../../common/enums/order-status.enum';
import { PaymentMethod } from '../../../common/enums/payment-method.enum';

export class OrderResponseDto {
  id: number;
  userId: number;

  totalAmount: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;

  createdAt: Date;

  items: OrderItemResponseDto[];

  payment?: {
    id: number;
    provider: string;
    transactionId?: string;
    status: string;
  };
}
