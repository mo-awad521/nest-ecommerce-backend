import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductsModule } from '../products/products.module';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    UsersModule,
    ProductsModule,
  ],
  providers: [OrdersService],
  exports: [TypeOrmModule],
  controllers: [OrdersController],
})
export class OrdersModule {}
