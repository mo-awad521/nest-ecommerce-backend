import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PaymentProvider } from '../../../common/enums/payment-provider.enum';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';

export class CreatePaymentRecordDto {
  @IsInt()
  orderId: number;

  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsEnum(PaymentStatus)
  status: PaymentStatus = PaymentStatus.PENDING;
}
