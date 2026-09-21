import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UpstreamHttpModule } from '../../common/upstream-http.module';

@Module({
  imports: [UpstreamHttpModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
