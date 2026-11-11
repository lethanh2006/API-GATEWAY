import { Module } from '@nestjs/common';

import { UpstreamHttpModule } from '../../common/http/upstream-http.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [UpstreamHttpModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
