import { Entity, Column, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('cart_items')
@Unique(['cart', 'product'])
export class CartItem extends BaseEntity {
  @ManyToOne(() => Cart, (cart) => cart.items, {
    onDelete: 'CASCADE',
  })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems, {
    onDelete: 'RESTRICT',
  })
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}
