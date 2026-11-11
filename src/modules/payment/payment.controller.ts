import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { AuthenticatedRequest } from '../../common/interfaces/request-context.interface';
import { PaymentHistoryQueryDto } from './dto/payment-history-query.dto';
import { PaymentService } from './payment.service';

/** Thanh toán đơn căn tin qua PayOS cho người đặt món; nhận webhook PayOS và chuyển tới Payment. */
@ApiTags('Api Payment')
@Controller('api/payment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /** Số tiền lấy từ đơn trong Canteen, client không gửi số tiền. */
  @Post('orders/:orderId/payos')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Tạo (hoặc lấy lại) link và mã QR PayOS cho đơn đang chờ thanh toán',
  })
  createPayosLink(
    @Param('orderId') orderId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.paymentService.createPayosLink(orderId, req.user);
  }

  @Get('orders/:orderId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Trạng thái thanh toán mới nhất của một đơn' })
  getLatestForOrder(
    @Param('orderId') orderId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.paymentService.getLatestForOrder(orderId, req.user);
  }

  @Get('payments/:paymentId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chi tiết một giao dịch thanh toán' })
  getPayment(
    @Param('paymentId') paymentId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.paymentService.getPayment(paymentId, req.user);
  }

  @Get('history')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lịch sử thanh toán của người dùng hiện tại' })
  getHistory(
    @Query() query: PaymentHistoryQueryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.paymentService.getHistory(query, req.user);
  }

  /** Công khai cho PayOS; Payment xác thực bằng checksum key của PayOS. */
  @Post('webhooks/payos')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Webhook PayOS báo giao dịch đã thanh toán' })
  handlePayosWebhook(@Body() payload: Record<string, unknown>) {
    return this.paymentService.forwardPayosWebhook(payload);
  }
}
