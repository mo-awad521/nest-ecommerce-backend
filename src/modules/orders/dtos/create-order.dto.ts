import {
  IsInt,
  IsEnum,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../../../common/enums/payment-method.enum';

class OrderItemInputDto {
  @IsInt()
  productId: number;

  @IsInt()
  quantity: number;
}

export class CreateOrderDto {
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  @ArrayMinSize(1)
  items: OrderItemInputDto[];

  @IsOptional()
  @IsInt()
  addressId?: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;
}
