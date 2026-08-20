import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [HttpModule],
  controllers: [PaymentController],
  providers: [PaymentService, InternalRequestSignatureService],
})
export class PaymentModule {}
