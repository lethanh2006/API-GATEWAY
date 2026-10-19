import { Module } from '@nestjs/common';

import { UpstreamHttpModule } from '../../common/http/upstream-http.module';
import { WorkscheduleAttendanceController } from './workschedule-attendance.controller';
import { WorkschedulePolicyController } from './workschedule-policy.controller';
import { WorkscheduleRequestController } from './workschedule-request.controller';
import { WorkscheduleScheduleController } from './workschedule-schedule.controller';
import { WorkscheduleService } from './workschedule.service';

@Module({
  imports: [UpstreamHttpModule],
  controllers: [
    WorkscheduleScheduleController,
    WorkscheduleAttendanceController,
    WorkschedulePolicyController,
    WorkscheduleRequestController,
  ],
  providers: [WorkscheduleService],
})
export class WorkscheduleModule {}
