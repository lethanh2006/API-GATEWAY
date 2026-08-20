import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/common/guard/jwt/jwt.guard';
import { RolesGuard } from '../auth/common/guard/role/role.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CreatePaymentQrDto } from './dto/create-payment-qr.dto';
import { PaymentHistoryQueryDto } from './dto/payment-history-query.dto';
import { PaymentService } from './payment.service';

@ApiTags('Api Payment')
@Controller('api/payment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-qr')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo VietQR từ số tiền chính thức của đơn hàng Canteen',
  })
  createQr(@Body() body: CreatePaymentQrDto, @Req() request: any) {
    return this.paymentService.createQr(body.orderId, request.user);
  }

  @Post('orders/:orderId/qr')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alias tạo VietQR theo orderId trên URL' })
  @ApiParam({ name: 'orderId', example: '66c6a6a6a6a6a6a6a6a6a6a6' })
  createQrByPath(@Param('orderId') orderId: string, @Req() request: any) {
    return this.paymentService.createQr(orderId, request.user);
  }

  @Get('orders/:orderId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy giao dịch mới nhất của một đơn hàng' })
  getLatestForOrder(@Param('orderId') orderId: string, @Req() request: any) {
    return this.paymentService.getLatestForOrder(orderId, request.user);
  }

  @Get('payments/:paymentId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy trạng thái giao dịch theo paymentId' })
  getPayment(
    @Param('paymentId', new ParseUUIDPipe()) paymentId: string,
    @Req() request: any,
  ) {
    return this.paymentService.getPayment(paymentId, request.user);
  }

  @Get('history')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy lịch sử thanh toán của người dùng hiện tại' })
  getHistory(@Query() query: PaymentHistoryQueryDto, @Req() request: any) {
    return this.paymentService.getHistory(query.limit, request.user);
  }

  @Post(['webhooks/casso', 'webhook/casso', 'callback'])
  @Public()
  @ApiOperation({ summary: 'Webhook Casso V2 (xác thực bằng HMAC-SHA512)' })
  forwardCassoWebhook(
    @Body() payload: unknown,
    @Headers('x-casso-signature') signature: string | undefined,
  ) {
    return this.paymentService.forwardCassoWebhook(payload, signature);
  }
}
