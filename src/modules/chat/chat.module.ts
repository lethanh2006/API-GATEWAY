import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';

@Module({
  imports: [HttpModule],
  controllers: [ChatController],
  providers: [ChatService, InternalRequestSignatureService],
})
export class ChatModule {}
