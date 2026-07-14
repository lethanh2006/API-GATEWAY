import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WorkscheduleService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.baseUrl = this.configService.get<string>('WORKSCHEDULE_SERVICE_URL', 'http://localhost:5004');
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

  async getPendingRequests(user: any) {
    return this.forward('GET', '/api/workschedule/schedule/pending', null, null, user);
  }

  async getAllRequests(user: any) {
    return this.forward('GET', '/api/workschedule/schedule/all', null, null, user);
  }

  async approveRequest(id: string, user: any) {
    return this.forward('POST', `/api/workschedule/schedule/requests/${id}/approve`, null, null, user);
  }

  async rejectRequest(id: string, user: any) {
    return this.forward('POST', `/api/workschedule/schedule/requests/${id}/reject`, null, null, user);
  }

  async bulkApprove(dto: any, user: any) {
    return this.forward('POST', '/api/workschedule/schedule/requests/bulk-approve', dto, null, user);
  }

  async getHeatmap(user: any) {
    return this.forward('GET', '/api/workschedule/schedule/heatmap', null, null, user);
  }

  async scanAttendance(dto: any, user: any) {
    return this.forward('POST', '/api/workschedule/attendance/scan', dto, null, user);
  }

  async getMyAttendance(user: any) {
    return this.forward('GET', '/api/workschedule/attendance/my', null, null, user);
  }

  async generateQrToken(user: any) {
    return this.forward('POST', '/api/workschedule/attendance/qr/generate', null, null, user);
  }

  async getTodayAttendance(user: any) {
    return this.forward('GET', '/api/workschedule/attendance/today', null, null, user);
  }

  async getReport(user: any) {
    return this.forward('GET', '/api/workschedule/attendance/report', null, null, user);
  }

  async getPolicy() {
    return this.forward('GET', '/api/workschedule/policy');
  }

  async updatePolicy(dto: any, user: any) {
    return this.forward('PATCH', '/api/workschedule/policy', dto, null, user);
  }

  async getMySchedules(user: any) {
    return this.forward('GET', '/api/workschedule/schedule/my', null, null, user);
  }

  async createRequest(dto: any, user: any) {
    return this.forward('POST', '/api/workschedule/schedule/requests', dto, null, user);
  }

  async getRequestInfo(id: string, user: any) {
    return this.forward('GET', `/api/workschedule/schedule/requests/${id}`, null, null, user);
  }

  async updateEntries(id: string, dto: any, user: any) {
    return this.forward('PATCH', `/api/workschedule/schedule/requests/${id}`, dto, null, user);
  }

  async submitRequest(id: string, user: any) {
    return this.forward('POST', `/api/workschedule/schedule/requests/${id}/submit`, null, null, user);
  }

  async deleteRequest(id: string, user: any) {
    return this.forward('DELETE', `/api/workschedule/schedule/requests/${id}`, null, null, user);
  }
}
