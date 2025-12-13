import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { OrderResponseDto } from './dtos/order-response.dto';
import { Address } from '../addresses/entities/address.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { Cart } from '../cart/entities/cart.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepo: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepo: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  // ========================================
  // CREATE ORDER (FROM CART) - TRANSACTION
  // ========================================
  async createFromCart(userId: number, addressId: number): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      // 1 Fetch user
      const user = await manager.findOne(User, {
        where: { id: userId },
      });

      if (!user) throw new NotFoundException('User not found');

      // 2️ Fetch cart with items + products
      const cart = await manager.findOne(Cart, {
        where: { user: { id: userId } },
        relations: {
          items: { product: true },
        },
      });

      if (!cart || cart.items.length === 0)
        throw new BadRequestException('Cart is empty');

      // 3️ Fetch shipping address
      const address = await manager.findOne(Address, {
        where: { id: addressId, user: { id: userId } },
      });

      if (!address) throw new BadRequestException('Invalid shipping address');

      // 4️ Calculate totals + validate stock
      let totalPrice = 0;
      let totalItems = 0;

      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${item.product.title}`,
          );
        }

        totalItems += item.quantity;
        totalPrice += Number(item.product.price) * item.quantity;
      }

      // 5️ Create order
      const order = manager.create(Order, {
        user,
        status: OrderStatus.PENDING,
        totalItems,
        totalPrice,

        shippingFullName: user.name,
        shippingPhone: '0936987462',
        shippingCountry: address.country,
        shippingCity: address.city,
        shippingStreet: address.street,
        shippingZipCode: address.postalCode,
      });

      const savedOrder = await manager.save(order);

      // 6️ Create order items + reduce stock
      for (const cartItem of cart.items) {
        const orderItem = manager.create(OrderItem, {
          order: savedOrder,
          product: cartItem.product,
          quantity: cartItem.quantity,
          price: cartItem.product.price,
        });

        await manager.save(orderItem);

        cartItem.product.stock -= cartItem.quantity;
        await manager.save(cartItem.product);
      }

      // 7️ Clear cart
      await manager.delete(CartItem, { cart: { id: cart.id } });

      return savedOrder;
    });
  }

  // -------------------------------------------------------------------------
  // Cancel Order
  // -------------------------------------------------------------------------
  async cancelOrder(userId: number, orderId: number) {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { id: orderId },
        relations: ['user', 'items', 'items.product'],
      });

      if (!order) throw new NotFoundException('Order not found');
      if (order.user?.id !== userId)
        throw new ForbiddenException('You cannot cancel this order');

      if (order.status !== OrderStatus.PENDING)
        throw new BadRequestException(
          'Order can only be canceled while pending',
        );

      order.status = OrderStatus.CANCELED;

      for (const item of order.items) {
        item.product.stock += item.quantity;
        await manager.save(item.product);
      }

      await manager.save(order);

      return { message: 'Order canceled successfully' };
    });
  }

  // -------------------------------------------------------------------------
  // Return / Refund Order
  // -------------------------------------------------------------------------
  async returnOrder(userId: number, orderId: number) {
    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) throw new NotFoundException('Order not found');

    if (order.user?.id !== userId) {
      throw new ForbiddenException('You cannot return this order');
    }

    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('Only delivered orders can be returned');
    }

    order.status = OrderStatus.RETURNED;
    await this.ordersRepo.save(order);

    return { message: 'Order returned successfully' };
  }

  // -------------------------------------------------------------------------
  //  Admin: Update Order Status
  // -------------------------------------------------------------------------
  async updateOrderStatus(orderId: number, dto: UpdateOrderStatusDto) {
    const order = await this.ordersRepo.findOne({ where: { id: orderId } });

    if (!order) throw new NotFoundException('Order not found');

    order.status = dto.status;
    await this.ordersRepo.save(order);

    return { message: 'Order status updated successfully' };
  }

  // -------------------------------------------------------------------------
  //  Get user orders
  // -------------------------------------------------------------------------
  async getUserOrders(userId: number) {
    const orders = await this.ordersRepo.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'items.product.images'],
      order: { createdAt: 'DESC' },
    });

    return orders.map((o) => this.toOrderResponse(o));
  }

  // -------------------------------------------------------------------------
  //  Helper: Convert to DTO
  // -------------------------------------------------------------------------
  private toOrderResponse(order: Order): OrderResponseDto {
    return {
      id: order.id,
      userId: order.user?.id,
      totalAmount: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: Number(item.price),
        productId: item.product.id,
        product: {
          id: item.product.id,
          title: item.product.title,
          price: Number(item.product.price),
          images: item.product.images,
        },
      })),
    };
  }
}
