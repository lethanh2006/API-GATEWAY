import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';

@Module({
  imports: [HttpModule],
  controllers: [UserController],
  providers: [UserService, InternalRequestSignatureService],
})
export class UserModule {}
