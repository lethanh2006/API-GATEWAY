import { Module } from '@nestjs/common';

import { UpstreamHttpModule } from '../../common/http/upstream-http.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [UpstreamHttpModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
