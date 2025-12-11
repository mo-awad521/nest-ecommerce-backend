import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';

import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('product/:productId')
  @ResponseMessage('Product reviews retrieved successfully')
  async getProductReviews(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewsService.getProductReviews(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('product/:productId')
  @ResponseMessage('Review added successfully')
  async createReview(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reviewsService.createReview(productId, dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':reviewId')
  @ResponseMessage('Review updated successfully')
  async updateReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() dto: UpdateReviewDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reviewsService.updateReview(reviewId, dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':reviewId')
  @ResponseMessage('Review deleted successfully')
  async deleteReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reviewsService.deleteReview(reviewId, user);
  }
}
