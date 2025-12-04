import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Order } from '../../orders/entities/order.entity';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';
import { PaymentProvider } from '../../../common/enums/payment-provider.enum';

@Entity('payments')
export class Payment extends BaseEntity {
  @OneToOne(() => Order, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  order: Order;

  @Column({
    type: 'enum',
    enum: PaymentProvider,
  })
  provider: PaymentProvider;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  transactionId?: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;
}
