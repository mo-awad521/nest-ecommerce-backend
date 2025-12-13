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
import { PaymentsService } from './payments.service';
import { CreatePaymentRecordDto } from './dtos/create-payment-record.dto';
import { UpdatePaymentStatusDto } from './dtos/update-payment-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // =====================================================
  //  Create payment (Mock checkout)
  // =====================================================
  @Post()
  async createPayment(@Body() dto: CreatePaymentRecordDto) {
    return this.paymentsService.createPayment(dto);
  }

  // =====================================================
  // Mock webhook / admin update
  // =====================================================
  @UseGuards(AdminGuard)
  @Patch(':id/status')
  async updatePaymentStatus(
    @Param('id', ParseIntPipe) paymentId: number,
    @Body() dto: UpdatePaymentStatusDto,
  ) {
    return this.paymentsService.updatePaymentStatus(paymentId, dto);
  }

  // =====================================================
  //  Get payment by order
  // =====================================================
  @Get('order/:orderId')
  async getPaymentByOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentsService.getPaymentByOrder(orderId);
  }
}
