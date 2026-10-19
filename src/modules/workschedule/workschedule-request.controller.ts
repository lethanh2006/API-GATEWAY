import {
  Body,
  Controller,
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
import { RejectRequestDto } from './dto/update-entries.dto';
import { CreateWorkRequestDto } from './dto/work-request.dto';
import { WorkscheduleService } from './workschedule.service';

/** Đơn từ nhân sự (nghỉ, đi muộn, về sớm, OT, công tác, remote); chuyển tiếp tới Workschedule. */
@ApiTags('Api Workschedule')
@Controller('api/workschedule')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkscheduleRequestController {
  constructor(private readonly workscheduleService: WorkscheduleService) {}

  @Get('requests/my/stats')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thống kê đơn từ cá nhân theo tháng' })
  getMyWorkRequestStats(
    @Query('month') month: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.getMyWorkRequestStats(month, req.user);
  }

  @Get('requests/my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy lịch sử đơn từ của bản thân' })
  getMyWorkRequests(
    @Query() query: Record<string, string>,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.getMyWorkRequests(query, req.user);
  }

  @Post('requests')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo đơn nghỉ, đi muộn, về sớm, OT, công tác hoặc remote',
  })
  createWorkRequest(
    @Body() body: CreateWorkRequestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.createWorkRequest(body, req.user);
  }

  @Patch('requests/:id/cancel')
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Hủy đơn đang chờ duyệt của bản thân' })
  cancelWorkRequest(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.workscheduleService.cancelWorkRequest(id, req.user);
  }

  @Get('requests/admin')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Lấy danh sách đơn từ để quản lý xử lý' })
  getAdminWorkRequests(
    @Query() query: Record<string, string>,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.getAdminWorkRequests(query, req.user);
  }

  @Post('requests/:id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Duyệt đơn từ của nhân viên' })
  approveWorkRequest(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.approveWorkRequest(id, req.user);
  }

  @Post('requests/:id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Từ chối đơn từ của nhân viên' })
  rejectWorkRequest(
    @Param('id') id: string,
    @Body() body: RejectRequestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.rejectWorkRequest(id, body, req.user);
  }
}
