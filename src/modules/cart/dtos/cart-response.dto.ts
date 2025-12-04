import { CartItemResponseDto } from './cart-item-response.dto';

export class CartResponseDto {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;

  items: CartItemResponseDto[];

  totalItems: number;
  totalPrice: number;
}
