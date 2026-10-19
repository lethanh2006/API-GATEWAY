import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';

import { UpstreamClient } from '../../common/http/upstream-client';
import type {
  GatewayUser,
  RequestWithContext,
} from '../../common/interfaces/request-context.interface';
import { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { MyTaskQueryDto, TaskQueryDto } from './dto/task-query.dto';
import type { UpcomingDeadlineQueryDto } from './dto/upcoming-deadline-query.dto';
import type { UpdateTaskDto } from './dto/update-task.dto';

@Injectable({ scope: Scope.REQUEST })
export class TodoService {
  private readonly upstream: UpstreamClient;

  constructor(
    httpService: HttpService,
    configService: ConfigService,
    @Inject(REQUEST) request: RequestWithContext,
    signatureService: InternalRequestSignatureService,
  ) {
    this.upstream = new UpstreamClient({
      httpService,
      signatureService,
      request,
      service: 'todo',
      baseUrl: configService.get<string>(
        'TODO_SERVICE_URL',
        'http://localhost:5003',
      ),
      label: 'Dịch vụ công việc',
    });
  }

  getMyTasks(query: MyTaskQueryDto, user: GatewayUser) {
    return this.upstream.get('/api/todo/my-tasks', { params: query, user });
  }

  updateTaskStatus(id: string, status: string, user: GatewayUser) {
    return this.upstream.patch(
      `/api/todo/${encodeURIComponent(id)}/status`,
      { status },
      { user },
    );
  }

  createTask(dto: CreateTaskDto, user: GatewayUser) {
    return this.upstream.post('/api/todo', dto, { user });
  }

  assignTask(id: string, assignedTo: string, user: GatewayUser) {
    return this.upstream.patch(
      `/api/todo/${encodeURIComponent(id)}/assign`,
      { assignedTo },
      { user },
    );
  }

  updateTask(id: string, dto: UpdateTaskDto, user: GatewayUser) {
    return this.upstream.patch(`/api/todo/${encodeURIComponent(id)}`, dto, {
      user,
    });
  }

  updateTaskPriority(id: string, priority: string, user: GatewayUser) {
    return this.upstream.patch(
      `/api/todo/${encodeURIComponent(id)}/priority`,
      { priority },
      { user },
    );
  }

  getAllTasks(query: TaskQueryDto, user: GatewayUser) {
    return this.upstream.get('/api/todo', { params: query, user });
  }

  getTaskById(id: string, user: GatewayUser) {
    return this.upstream.get(`/api/todo/${encodeURIComponent(id)}`, { user });
  }

  updateTaskDeadline(id: string, deadline: string, user: GatewayUser) {
    return this.upstream.patch(
      `/api/todo/${encodeURIComponent(id)}/deadline`,
      { deadline },
      { user },
    );
  }

  updateTaskProgress(id: string, progress: number, user: GatewayUser) {
    return this.upstream.patch(
      `/api/todo/${encodeURIComponent(id)}/progress`,
      { progress },
      { user },
    );
  }

  getOverdue(user: GatewayUser) {
    return this.upstream.get('/api/todo/overdue', { user });
  }

  getUpcomingDeadline(query: UpcomingDeadlineQueryDto, user: GatewayUser) {
    return this.upstream.get('/api/todo/upcoming-deadline', {
      params: query,
      user,
    });
  }

  deleteTask(id: string, user: GatewayUser) {
    return this.upstream.delete(`/api/todo/${encodeURIComponent(id)}`, {
      user,
    });
  }
}
