import { Module } from '@nestjs/common';

import { UpstreamHttpModule } from '../../common/http/upstream-http.module';
import { PaymentRefundController } from './payment-refund.controller';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [UpstreamHttpModule],
  controllers: [PaymentController, PaymentRefundController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
