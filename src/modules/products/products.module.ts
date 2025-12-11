import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Review } from '../reviews/entities/review.entity';
import { Wishlist } from '../wishlist/entities/wishlist.entity';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CartModule } from '../cart/cart.module';

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
    CloudinaryModule,
    forwardRef(() => CartModule),
  ],
  providers: [ProductsService],
  exports: [TypeOrmModule, ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
