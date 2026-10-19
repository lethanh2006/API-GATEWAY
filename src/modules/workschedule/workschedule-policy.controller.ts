import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { AuthenticatedRequest } from '../../common/interfaces/request-context.interface';
import { UpdatePolicyDto } from './dto/update-entries.dto';
import { WorkscheduleService } from './workschedule.service';

/** Chính sách chấm công: xem công khai, chỉ ADMIN sửa; chuyển tiếp tới Workschedule. */
@ApiTags('Api Workschedule')
@Controller('api/workschedule')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkschedulePolicyController {
  constructor(private readonly workscheduleService: WorkscheduleService) {}

  @Get('policy')
  @Public()
  @ApiOperation({ summary: 'Lấy chính sách chấm công (PUBLIC)' })
  getPolicy() {
    return this.workscheduleService.getPolicy();
  }

  @Patch('policy')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật chính sách chấm công (Admin)' })
  updatePolicy(
    @Body() body: UpdatePolicyDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workscheduleService.updatePolicy(body, req.user);
  }
}
