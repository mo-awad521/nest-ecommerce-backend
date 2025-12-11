import { Controller, Get, Post, Delete, Body, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dtos/add-to-wishlist.dto';
import { RemoveFromWishlistDto } from './dtos/remove-from-wishlist.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ResponseMessage('Wishlist retrieved successfully')
  async getWishlist(@CurrentUser() user: JwtPayload) {
    return this.wishlistService.getWishlist(user);
  }

  @Post()
  @ResponseMessage('Item added to wishlist')
  async addToWishlist(
    @Body() dto: AddToWishlistDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.wishlistService.addToWishlist(dto, user);
  }

  @Delete()
  @ResponseMessage('Item removed from wishlist')
  async removeFromWishlist(
    @Body() dto: RemoveFromWishlistDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.wishlistService.removeFromWishlist(dto, user);
  }
}
