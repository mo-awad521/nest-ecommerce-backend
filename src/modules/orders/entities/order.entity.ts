import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../../../common/enums/order-status.enum';

@Entity('orders')
export class Order extends BaseEntity {
  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'SET NULL', // لا نحذف الطلبات إذا حذف المستخدم
    nullable: true,
  })
  user: User;

  // حالة الطلب
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  // السعر الإجمالي المحسوب عند إنشاء الطلب
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  // عدد العناصر داخل الطلب
  @Column({ type: 'int' })
  totalItems: number;

  // عنوان الشحن يتم نسخه من عنوان المستخدم
  @Column({ type: 'varchar', length: 255 })
  shippingFullName: string;

  @Column({ type: 'varchar', length: 255 })
  shippingPhone: string;

  @Column({ type: 'varchar', length: 255 })
  shippingCountry: string;

  @Column({ type: 'varchar', length: 255 })
  shippingCity: string;

  @Column({ type: 'varchar', length: 255 })
  shippingStreet: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  shippingZipCode?: string;

  // رقم تتبع الشحنة
  @Column({ type: 'varchar', length: 255, nullable: true })
  trackingNumber?: string;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
  })
  items: OrderItem[];
}
