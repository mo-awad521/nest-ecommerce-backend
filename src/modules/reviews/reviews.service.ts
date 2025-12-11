import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { JwtPayload } from '../auth/types/jwt-payload.type';

import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,

    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  /**
   * Get reviews for a product
   */
  async getProductReviews(productId: number) {
    return this.reviewRepo.find({
      where: { product: { id: productId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Create review
   */
  async createReview(
    productId: number,
    dto: CreateReviewDto,
    user: JwtPayload,
  ) {
    const foundUser = await this.usersService.findById(user.sub);
    if (!foundUser) throw new NotFoundException('User not found');

    const product = await this.productsService.findOne(productId);
    if (!product) throw new NotFoundException('Product not found');

    // Ensure user doesn't review same product twice
    const existing = await this.reviewRepo.findOne({
      where: {
        user: { id: user.sub },
        product: { id: productId },
      },
    });

    if (existing) {
      throw new ForbiddenException('You already reviewed this product');
    }

    const review = this.reviewRepo.create({
      rating: dto.rating,
      comment: dto.comment,
      user: foundUser,
      product,
    });

    return this.reviewRepo.save(review);
  }

  /**
   * Update review
   */
  async updateReview(reviewId: number, dto: UpdateReviewDto, user: JwtPayload) {
    const review = await this.reviewRepo.findOne({
      where: { id: reviewId },
      relations: ['user'],
    });

    if (!review) throw new NotFoundException('Review not found');
    if (review.user.id !== user.sub)
      throw new ForbiddenException('You cannot edit this review');

    Object.assign(review, dto);
    return this.reviewRepo.save(review);
  }

  /**
   * Delete review
   */
  async deleteReview(reviewId: number, user: JwtPayload) {
    const review = await this.reviewRepo.findOne({
      where: { id: reviewId },
      relations: ['user'],
    });

    if (!review) throw new NotFoundException('Review not found');
    if (review.user.id !== user.sub)
      throw new ForbiddenException('You cannot delete this review');

    await this.reviewRepo.remove(review);

    return { message: 'Review deleted successfully' };
  }
}
