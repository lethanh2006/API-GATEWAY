import { Module } from '@nestjs/common';
import { WorkscheduleController } from './workschedule.controller';
import { WorkscheduleService } from './workschedule.service';
import { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';
import { UpstreamHttpModule } from '../../common/http/upstream-http.module';

@Module({
  imports: [UpstreamHttpModule],
  controllers: [WorkscheduleController],
  providers: [WorkscheduleService, InternalRequestSignatureService],
})
export class WorkscheduleModule {}
