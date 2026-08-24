import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';

@Module({
  imports: [HttpModule],
  controllers: [TodoController],
  providers: [TodoService, InternalRequestSignatureService],
})
export class TodoModule {}
