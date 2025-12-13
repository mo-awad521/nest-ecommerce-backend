import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';
import { AdminGuard } from '../../common/guards/admin.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ======================================================
  // Create Order FROM CART
  // ======================================================
  @Post()
  async createOrderFromCart(
    @CurrentUser() user: JwtPayload,
    @Body('addressId', ParseIntPipe) addressId: number,
  ) {
    return this.ordersService.createFromCart(user.sub, addressId);
  }

  // ======================================================
  // Get current user's orders
  // ======================================================
  @Get('my')
  async getMyOrders(@CurrentUser() user: JwtPayload) {
    return this.ordersService.getUserOrders(user.sub);
  }

  // ======================================================
  //  Cancel order (user)
  // ======================================================
  @Patch(':id/cancel')
  async cancelOrder(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.ordersService.cancelOrder(user.sub, orderId);
  }

  // ======================================================
  //  Return order (user)
  // ======================================================
  @Patch(':id/return')
  async returnOrder(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.ordersService.returnOrder(user.sub, orderId);
  }

  // ======================================================
  //  Admin: Update order status
  //
  // ======================================================
  @UseGuards(AdminGuard)
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(orderId, dto);
  }
}
