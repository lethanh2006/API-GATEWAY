import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TodoService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.baseUrl = this.configService.get<string>('TODO_SERVICE_URL', 'http://localhost:5003');
  }

  private async forward(method: string, path: string, data?: any, params?: any, user?: any) {
    const headers: Record<string, string> = {};
    if (user) {
      const userPayloadStr = JSON.stringify(user);
      const base64User = Buffer.from(userPayloadStr).toString('base64');
      headers['x-user-payload'] = base64User;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url: `${this.baseUrl}${path}`,
          data,
          params,
          headers,
        })
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      throw error;
    }
  }

  async getMyTasks(user: any) {
    return this.forward('GET', '/api/todo/my-tasks', null, null, user);
  }

  async updateTaskStatus(id: string, status: string, user: any) {
    return this.forward('PATCH', `/api/todo/${id}/status`, { status }, null, user);
  }

  async createTask(dto: any, user: any) {
    return this.forward('POST', '/api/todo', dto, null, user);
  }

  async assignTask(id: string, assignedTo: string, user: any) {
    return this.forward('PATCH', `/api/todo/${id}/assign`, { assignedTo }, null, user);
  }

  async getAllTasks(user: any) {
    return this.forward('GET', '/api/todo', null, null, user);
  }

  async deleteTask(id: string, user: any) {
    return this.forward('DELETE', `/api/todo/${id}`, null, null, user);
  }
}
