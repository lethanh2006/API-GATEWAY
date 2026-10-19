import { Module } from '@nestjs/common';

import { UpstreamHttpModule } from '../../common/http/upstream-http.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UpstreamHttpModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
