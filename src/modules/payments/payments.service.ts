import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
//import { PaymentProvider } from '../../common/enums/payment-provider.enum';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { CreatePaymentRecordDto } from './dtos/create-payment-record.dto';
import { UpdatePaymentStatusDto } from './dtos/update-payment-status.dto';
import { PaymentResponseDto } from './dtos/payment-response.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepo: Repository<Payment>,
    @InjectRepository(Order)
    private ordersRepo: Repository<Order>,
    private dataSource: DataSource,
  ) {}

  // =====================================================
  //  Create payment record (Mock checkout)
  // =====================================================
  async createPayment(
    dto: CreatePaymentRecordDto,
  ): Promise<PaymentResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { id: dto.orderId },
      });

      if (!order) throw new NotFoundException('Order not found');

      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException('Only pending orders can be paid');
      }

      const existingPayment = await manager.findOne(Payment, {
        where: { order: { id: order.id } },
      });

      if (existingPayment) {
        throw new BadRequestException('Payment already exists for this order');
      }

      //Mock transaction id
      const transactionId =
        dto.transactionId ??
        `MOCK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      const payment = manager.create(Payment, {
        order,
        provider: dto.provider,
        transactionId,
        status: PaymentStatus.PENDING,
      });

      const savedPayment = await manager.save(payment);

      return this.toResponse(savedPayment);
    });
  }

  // =====================================================
  // Update payment status (Mock webhook)
  // =====================================================
  async updatePaymentStatus(paymentId: number, dto: UpdatePaymentStatusDto) {
    return this.dataSource.transaction(async (manager) => {
      const payment = await manager.findOne(Payment, {
        where: { id: paymentId },
        relations: ['order'],
      });

      if (!payment) throw new NotFoundException('Payment not found');

      payment.status = dto.status;

      if (dto.transactionId) {
        payment.transactionId = dto.transactionId;
      }

      await manager.save(payment);

      // Sync Order Status
      if (dto.status === PaymentStatus.SUCCESS) {
        payment.order.status = OrderStatus.PAID;
        await manager.save(payment.order);
      }

      if (
        dto.status === PaymentStatus.FAILED ||
        dto.status === PaymentStatus.REFUNDED
      ) {
        payment.order.status = OrderStatus.CANCELED;
        await manager.save(payment.order);
      }

      return this.toResponse(payment);
    });
  }

  // =====================================================
  // Get payment by order
  // =====================================================
  async getPaymentByOrder(orderId: number): Promise<PaymentResponseDto> {
    const payment = await this.paymentsRepo.findOne({
      where: { order: { id: orderId } },
      relations: ['order'],
    });

    if (!payment) throw new NotFoundException('Payment not found');

    return this.toResponse(payment);
  }

  // =====================================================
  //Mapper
  // =====================================================
  private toResponse(payment: Payment): PaymentResponseDto {
    return {
      id: payment.id,
      orderId: payment.order.id,
      provider: payment.provider,
      transactionId: payment.transactionId,
      status: payment.status,
      createdAt: payment.createdAt,
    };
  }
}
