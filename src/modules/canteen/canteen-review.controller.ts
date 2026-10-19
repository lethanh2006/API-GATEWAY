import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
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
import { ReplyReviewDto } from './dto/reply-review.dto';
import { ReviewQueryDto, ReviewSummaryQueryDto } from './dto/review-query.dto';
import { UpsertReviewDto } from './dto/upsert-review.dto';

/** Đánh giá đơn hàng căn tin và phản hồi của ADMIN; chuyển tiếp tới Canteen. */
@ApiTags('Api Canteen')
@Controller('api/canteen')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CanteenReviewController {
  constructor(private readonly canteenService: CanteenService) {}

  @Put('orders/:id/review')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Chủ đơn tạo hoặc sửa đánh giá cho đơn đã thanh toán (trong 7 ngày, chưa được phản hồi)',
  })
  upsertReview(
    @Param('id') id: string,
    @Body() body: UpsertReviewDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.canteenService.upsertReview(id, body, req.user);
  }

  @Get('reviews/my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xem các đánh giá của chính người dùng' })
  getMyReviews(@Req() req: AuthenticatedRequest) {
    return this.canteenService.getMyReviews(req.user);
  }

  @Get('reviews/summary')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary:
      'Thống kê đánh giá: điểm trung bình, phân bố sao, chưa phản hồi (ADMIN)',
  })
  getReviewSummary(
    @Query() query: ReviewSummaryQueryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.canteenService.getReviewSummary(query, req.user);
  }

  @Get('reviews')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Danh sách đánh giá có lọc và phân trang (ADMIN)',
  })
  getReviews(@Query() query: ReviewQueryDto, @Req() req: AuthenticatedRequest) {
    return this.canteenService.getReviews(query, req.user);
  }

  @Patch('reviews/:id/reply')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Phản hồi hoặc sửa phản hồi cho đánh giá (ADMIN)' })
  replyToReview(
    @Param('id') id: string,
    @Body() body: ReplyReviewDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.canteenService.replyToReview(id, body, req.user);
  }
}
