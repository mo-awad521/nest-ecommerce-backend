import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    forwardRef(() => UsersModule),
    forwardRef(() => ProductsModule),
  ],
  providers: [CartService],
  exports: [TypeOrmModule],
  controllers: [CartController],
})
export class CartModule {}
