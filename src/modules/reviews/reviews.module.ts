import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), UsersModule, ProductsModule],
  providers: [ReviewsService],
  exports: [TypeOrmModule],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
