import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CanteenService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.baseUrl = this.configService.get<string>('CANTEEN_SERVICE_URL', 'http://localhost:5005');
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

  async getMenu() {
    return this.forward('GET', '/api/canteen/menu');
  }

  async createMenuItem(dto: any, user: any) {
    return this.forward('POST', '/api/canteen/admin/menu', dto, null, user);
  }

  async updateMenuItem(id: string, dto: any, user: any) {
    return this.forward('PUT', `/api/canteen/admin/menu/${id}`, dto, null, user);
  }

  async deleteMenuItem(id: string, user: any) {
    return this.forward('DELETE', `/api/canteen/admin/menu/${id}`, null, null, user);
  }

  async undoMenuItemChange(user: any) {
    return this.forward('POST', '/api/canteen/admin/menu/undo', null, null, user);
  }

  async redoMenuItemChange(user: any) {
    return this.forward('POST', '/api/canteen/admin/menu/redo', null, null, user);
  }
}
