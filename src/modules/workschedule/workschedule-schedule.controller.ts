import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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

import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { AuthenticatedRequest } from '../../common/interfaces/request-context.interface';
import { CreateScheduleRequestDto } from './dto/create-request.dto';
import {
  BulkApproveDto,
  RejectRequestDto,
  UpdateScheduleEntriesDto,
} from './dto/update-entries.dto';
import { WorkscheduleService } from './workschedule.service';

/** Đăng ký, duyệt và thống kê lịch làm việc theo tháng; chuyển tiếp tới Workschedule. */
@ApiTags('Api Workschedule')
@Controller('api/workschedule')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkscheduleScheduleController {
  constructor(private readonly workscheduleService: WorkscheduleService) {}

  @Get('schedule/pending')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({
    summary: 'Lấy danh sách yêu cầu lịch làm việc chờ phê duyệt (Admin)',
  })
  getPendingRequests(
    @Query() query: Record<string, string>,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.getPendingRequests(query, req.user);
  }

  @Get('schedule/all')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({
    summary: 'Lấy tất cả danh sách yêu cầu lịch làm việc (Admin)',
  })
  getAllRequests(
    @Query() query: Record<string, string>,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.getAllRequests(query, req.user);
  }

  @Post('schedule/requests/:id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Duyệt yêu cầu lịch làm việc (Admin)' })
  @ApiParam({ name: 'id', example: 'req123' })
  approveRequest(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.workscheduleService.approveRequest(id, req.user);
  }

  @Post('schedule/requests/:id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Từ chối yêu cầu lịch làm việc (Admin)' })
  @ApiParam({ name: 'id', example: 'req123' })
  rejectRequest(
    @Param('id') id: string,
    @Body() body: RejectRequestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.rejectRequest(id, body, req.user);
  }

  @Post('schedule/requests/bulk-approve')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({
    summary: 'Phê duyệt hàng loạt yêu cầu lịch làm việc (Admin)',
  })
  bulkApprove(@Body() body: BulkApproveDto, @Req() req: AuthenticatedRequest) {
    return this.workscheduleService.bulkApprove(body, req.user);
  }

  @Get('schedule/heatmap')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Lấy dữ liệu heatmap lịch làm việc (Admin)' })
  getHeatmap(
    @Query() query: Record<string, string>,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.getHeatmap(query, req.user);
  }

  @Get('schedule/monthly-overview')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy lịch làm việc và thống kê cá nhân theo tháng' })
  getMonthlyOverview(
    @Query('month') month: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.getMonthlyOverview(month, req.user);
  }

  @Get('schedule/my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách lịch làm việc của bản thân' })
  getMySchedules(
    @Query() query: Record<string, string>,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.getMySchedules(query, req.user);
  }

  @Post('schedule/requests')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo và gửi yêu cầu đăng ký lịch làm việc' })
  createRequest(
    @Body() body: CreateScheduleRequestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.createRequest(body, req.user);
  }

  @Post('schedule/requests/:id/resubmit')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chỉnh sửa và gửi lại yêu cầu lịch bị từ chối' })
  @ApiParam({ name: 'id', example: 'req123' })
  resubmitRequest(
    @Param('id') id: string,
    @Body() body: UpdateScheduleEntriesDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.resubmitRequest(id, body, req.user);
  }

  @Get('schedule/requests/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Xem chi tiết một yêu cầu lịch làm việc' })
  @ApiParam({ name: 'id', example: 'req123' })
  getRequestInfo(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.workscheduleService.getRequestInfo(id, req.user);
  }

  @Patch('schedule/requests/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Cập nhật nội dung một yêu cầu lịch làm việc' })
  @ApiParam({ name: 'id', example: 'req123' })
  updateEntries(
    @Param('id') id: string,
    @Body() body: UpdateScheduleEntriesDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.updateEntries(id, body, req.user);
  }

  @Delete('schedule/requests/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Xóa yêu cầu đăng ký lịch làm việc' })
  @ApiParam({ name: 'id', example: 'req123' })
  deleteRequest(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.workscheduleService.deleteRequest(id, req.user);
  }
}
