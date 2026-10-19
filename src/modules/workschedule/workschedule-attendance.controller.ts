import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { ScanAttendanceDto } from './dto/update-entries.dto';
import { WorkscheduleService } from './workschedule.service';

/** Chấm công bằng QR và báo cáo điểm danh; chuyển tiếp tới Workschedule. */
@ApiTags('Api Workschedule')
@Controller('api/workschedule')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkscheduleAttendanceController {
  constructor(private readonly workscheduleService: WorkscheduleService) {}

  @Post('attendance/scan')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Điểm danh bằng quét QR Code' })
  scanAttendance(
    @Body() body: ScanAttendanceDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.scanAttendance(body, req.user);
  }

  @Get('attendance/my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách điểm danh cá nhân' })
  getMyAttendance(
    @Query() query: Record<string, string>,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.getMyAttendance(query, req.user);
  }

  @Post('attendance/qr/generate')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Tạo mã QR Code điểm danh (Admin)' })
  generateQrToken(@Req() req: AuthenticatedRequest) {
    return this.workscheduleService.generateQrToken(req.user);
  }

  @Get('attendance/today')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Lấy danh sách điểm danh hôm nay (Admin)' })
  getTodayAttendance(@Req() req: AuthenticatedRequest) {
    return this.workscheduleService.getTodayAttendance(req.user);
  }

  @Get('attendance/report')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Lấy báo cáo điểm danh (Admin)' })
  getReport(
    @Query() query: Record<string, string>,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.getReport(query, req.user);
  }
}
