import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.baseUrl = this.configService.get<string>('USER_SERVICE_URL', 'http://localhost:5000');
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

  async getMyProfile(user: any) {
    return this.forward('GET', '/api/user/me', null, null, user);
  }

  async getPublicProfile(userId: string, user: any) {
    return this.forward('GET', `/api/user/user/${userId}`, null, null, user);
  }

  async getFullProfileByAdmin(userId: string, user: any) {
    return this.forward('GET', `/api/user/user/${userId}`, null, null, user);
  }
}
