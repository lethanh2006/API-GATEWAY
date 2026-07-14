import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { WorkscheduleService } from './workschedule.service';
import { JwtAuthGuard } from '../auth/common/guard/jwt/jwt.guard';
import { RolesGuard } from '../auth/common/guard/role/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '../../common/enums/role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CreateScheduleRequestDto } from './dto/create-request.dto';
import { UpdateScheduleEntriesDto, UpdatePolicyDto, ScanAttendanceDto, RejectRequestDto, BulkApproveDto } from './dto/update-entries.dto';

@ApiTags('Api Workschedule')
@Controller('api/workschedule')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkscheduleController {
  constructor(private readonly workscheduleService: WorkscheduleService) {}

  // ============================================================
  // ADMIN — Lịch trình quản trị
  // ============================================================

  @Get('schedule/pending')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách yêu cầu lịch làm việc chờ phê duyệt (Admin)' })
  async getPendingRequests(@Req() req: any) {
    return this.workscheduleService.getPendingRequests(req.user);
  }

  @Get('schedule/all')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy tất cả danh sách yêu cầu lịch làm việc (Admin)' })
  async getAllRequests(@Req() req: any) {
    return this.workscheduleService.getAllRequests(req.user);
  }

  @Post('schedule/requests/:id/approve')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Duyệt yêu cầu lịch làm việc (Admin)' })
  @ApiParam({ name: 'id', example: 'req123' })
  async approveRequest(@Param('id') id: string, @Req() req: any) {
    return this.workscheduleService.approveRequest(id, req.user);
  }

  @Post('schedule/requests/:id/reject')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Từ chối yêu cầu lịch làm việc (Admin)' })
  @ApiParam({ name: 'id', example: 'req123' })
  async rejectRequest(@Param('id') id: string, @Body() body: RejectRequestDto, @Req() req: any) {
    return this.workscheduleService.rejectRequest(id, req.user);
  }

  @Post('schedule/requests/bulk-approve')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Phê duyệt hàng loạt yêu cầu lịch làm việc (Admin)' })
  async bulkApprove(@Body() body: BulkApproveDto, @Req() req: any) {
    return this.workscheduleService.bulkApprove(body, req.user);
  }

  @Get('schedule/heatmap')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy dữ liệu heatmap lịch làm việc (Admin)' })
  async getHeatmap(@Req() req: any) {
    return this.workscheduleService.getHeatmap(req.user);
  }

  // ============================================================
  // USER / ADMIN — Điểm danh (Attendance)
  // ============================================================

  @Post('attendance/scan')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Điểm danh bằng quét QR Code' })
  async scanAttendance(@Body() body: ScanAttendanceDto, @Req() req: any) {
    return this.workscheduleService.scanAttendance(body, req.user);
  }

  @Get('attendance/my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách điểm danh cá nhân' })
  async getMyAttendance(@Req() req: any) {
    return this.workscheduleService.getMyAttendance(req.user);
  }

  @Post('attendance/qr/generate')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Tạo mã QR Code điểm danh (Admin)' })
  async generateQrToken(@Req() req: any) {
    return this.workscheduleService.generateQrToken(req.user);
  }

  @Get('attendance/today')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách điểm danh hôm nay (Admin)' })
  async getTodayAttendance(@Req() req: any) {
    return this.workscheduleService.getTodayAttendance(req.user);
  }

  @Get('attendance/report')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy báo cáo điểm danh (Admin)' })
  async getReport(@Req() req: any) {
    return this.workscheduleService.getReport(req.user);
  }

  // ============================================================
  // PUBLIC / ADMIN — Chính sách điểm danh (Policy)
  // ============================================================

  @Get('policy')
  @Public()
  @ApiOperation({ summary: 'Lấy chính sách chấm công (PUBLIC)' })
  async getPolicy() {
    return this.workscheduleService.getPolicy();
  }

  @Patch('policy')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật chính sách chấm công (Admin)' })
  async updatePolicy(@Body() body: UpdatePolicyDto, @Req() req: any) {
    return this.workscheduleService.updatePolicy(body, req.user);
  }

  // ============================================================
  // USER — Đăng ký lịch làm việc (Schedule requests)
  // ============================================================

  @Get('schedule/my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách lịch làm việc của bản thân' })
  async getMySchedules(@Req() req: any) {
    return this.workscheduleService.getMySchedules(req.user);
  }

  @Post('schedule/requests')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo yêu cầu đăng ký lịch làm việc mới' })
  async createRequest(@Body() body: CreateScheduleRequestDto, @Req() req: any) {
    return this.workscheduleService.createRequest(body, req.user);
  }

  @Get('schedule/requests/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xem chi tiết một yêu cầu lịch làm việc' })
  @ApiParam({ name: 'id', example: 'req123' })
  async getRequestInfo(@Param('id') id: string, @Req() req: any) {
    return this.workscheduleService.getRequestInfo(id, req.user);
  }

  @Patch('schedule/requests/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật nội dung một yêu cầu lịch làm việc' })
  @ApiParam({ name: 'id', example: 'req123' })
  async updateEntries(@Param('id') id: string, @Body() body: UpdateScheduleEntriesDto, @Req() req: any) {
    return this.workscheduleService.updateEntries(id, body, req.user);
  }

  @Post('schedule/requests/:id/submit')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Nộp yêu cầu đăng ký lịch làm việc lên cấp trên' })
  @ApiParam({ name: 'id', example: 'req123' })
  async submitRequest(@Param('id') id: string, @Req() req: any) {
    return this.workscheduleService.submitRequest(id, req.user);
  }

  @Delete('schedule/requests/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa yêu cầu đăng ký lịch làm việc' })
  @ApiParam({ name: 'id', example: 'req123' })
  async deleteRequest(@Param('id') id: string, @Req() req: any) {
    return this.workscheduleService.deleteRequest(id, req.user);
  }
}
