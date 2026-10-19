import { Module } from '@nestjs/common';

import { UpstreamHttpModule } from '../../common/http/upstream-http.module';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [UpstreamHttpModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
