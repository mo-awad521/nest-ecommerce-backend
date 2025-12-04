import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    onDelete: 'RESTRICT',
  })
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // السعر عند الشراء
}
