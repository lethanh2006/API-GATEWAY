import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WorkscheduleController } from './workschedule.controller';
import { WorkscheduleService } from './workschedule.service';
import { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';

@Module({
  imports: [HttpModule],
  controllers: [WorkscheduleController],
  providers: [WorkscheduleService, InternalRequestSignatureService],
})
export class WorkscheduleModule {}
