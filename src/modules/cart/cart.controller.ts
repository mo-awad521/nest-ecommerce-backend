import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dtos/add-to-cart.dto';
import { UpdateCartItemDto } from './dtos/update-cart-item.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.getCart(user.sub);
  }

  @Post()
  async addToCart(@CurrentUser() user: JwtPayload, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(user.sub, dto);
  }

  @Patch(':itemId')
  async updateItem(
    @CurrentUser() user: JwtPayload,
    @Param('itemId') itemId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(user.sub, itemId, dto);
  }

  @Delete(':itemId')
  async removeItem(
    @CurrentUser() user: JwtPayload,
    @Param('itemId') itemId: number,
  ) {
    return this.cartService.removeItem(user.sub, itemId);
  }

  @Delete()
  async clearCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.clearCart(user.sub);
  }
}
