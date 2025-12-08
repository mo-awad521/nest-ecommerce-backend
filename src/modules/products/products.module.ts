import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Review } from '../reviews/entities/review.entity';
import { Wishlist } from '../wishlist/entities/wishlist.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      Review,
      OrderItem,
      CartItem,
      Wishlist,
    ]),
    CategoriesModule,
  ],
  providers: [],
  exports: [TypeOrmModule],
  controllers: [],
})
export class ProductsModule {}
