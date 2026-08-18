import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CanteenController } from './canteen.controller';
import { CanteenService } from './canteen.service';
import { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';

@Module({
  imports: [HttpModule],
  controllers: [CanteenController],
  providers: [CanteenService, InternalRequestSignatureService],
})
export class CanteenModule {}
