import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';
import { UpstreamHttpModule } from '../../common/http/upstream-http.module';

@Module({
  imports: [UpstreamHttpModule],
  controllers: [UserController],
  providers: [UserService, InternalRequestSignatureService],
})
export class UserModule {}
