import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WorkscheduleController } from './workschedule.controller';
import { WorkscheduleService } from './workschedule.service';

@Module({
  imports: [HttpModule],
  controllers: [WorkscheduleController],
  providers: [WorkscheduleService],
})
export class WorkscheduleModule {}
