import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
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
import { RefundQueryDto } from './dto/refund-query.dto';
import { ResolveRefundDto } from './dto/resolve-refund.dto';
import { PaymentService } from './payment.service';

/** Hồ sơ hoàn tiền (tiền về không gắn được vào đơn) cho admin, quản lý và thu ngân. */
@ApiTags('Api Payment')
@Controller('api/payment/refunds')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER, Role.CASHIER)
export class PaymentRefundController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Danh sách hồ sơ hoàn tiền, mới nhất trước' })
  listRefunds(
    @Query() query: RefundQueryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.paymentService.listRefunds(query, req.user);
  }

  @Post(':caseId/resolve')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Chốt hồ sơ: đã hoàn tiền hoặc bỏ qua (mỗi hồ sơ chỉ chốt được một lần)',
  })
  resolveRefund(
    @Param('caseId', new ParseUUIDPipe()) caseId: string,
    @Body() body: ResolveRefundDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.paymentService.resolveRefund(caseId, body, req.user);
  }
}
