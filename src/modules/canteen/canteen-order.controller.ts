import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { AuthenticatedRequest } from '../../common/interfaces/request-context.interface';
import { CanteenService } from './canteen.service';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';

/** Đơn hàng căn tin thu tiền mặt; chuyển tiếp tới Canteen. */
@ApiTags('Api Canteen')
@Controller('api/canteen')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CanteenOrderController {
  constructor(private readonly canteenService: CanteenService) {}

  @Post('orders')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo đơn hàng với trạng thái ban đầu CREATED',
  })
  createOrder(@Body() body: CreateOrderDto, @Req() req: AuthenticatedRequest) {
    return this.canteenService.createOrder(body, req.user);
  }

  @Get('orders')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary:
      'Lấy danh sách đơn hàng có lọc và phân trang cho nhân viên vận hành',
  })
  getOrders(@Query() query: OrderQueryDto, @Req() req: AuthenticatedRequest) {
    return this.canteenService.getOrders(query, req.user);
  }

  @Get('orders/my-orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xem lịch sử đơn hàng cá nhân' })
  getMyOrders(@Req() req: AuthenticatedRequest) {
    return this.canteenService.getMyOrders(req.user);
  }

  @Get('orders/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin chi tiết của một đơn hàng' })
  getOrderById(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.canteenService.getOrderById(id, req.user);
  }

  @Patch('orders/:id/cancel')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Hủy đơn hàng (chủ đơn hoặc nhân viên có quyền vận hành)',
  })
  cancelOrder(
    @Param('id') id: string,
    @Body() body: CancelOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.canteenService.cancelOrder(id, body, req.user);
  }

  @Patch('orders/:id/payment/cash')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Admin xác nhận đã thu tiền mặt và đóng đơn',
  })
  confirmCashPayment(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.canteenService.confirmCashPayment(id, req.user);
  }
}
