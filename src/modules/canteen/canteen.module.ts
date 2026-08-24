import { Module } from '@nestjs/common';
import { CanteenController } from './canteen.controller';
import { CanteenService } from './canteen.service';
import { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';
import { UpstreamHttpModule } from '../../common/http/upstream-http.module';

@Module({
  imports: [UpstreamHttpModule],
  controllers: [CanteenController],
  providers: [CanteenService, InternalRequestSignatureService],
})
export class CanteenModule {}
