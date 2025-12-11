import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), UsersModule, ProductsModule],
  providers: [WishlistService],
  exports: [TypeOrmModule],
  controllers: [WishlistController],
})
export class WishlistModule {}
