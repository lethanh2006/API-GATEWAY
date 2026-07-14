import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.baseUrl = this.configService.get<string>('CHAT_SERVICE_URL', 'http://localhost:5002');
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

  async createChat(dto: any, user: any) {
    return this.forward('POST', '/api/chat/chat/new', dto, null, user);
  }

  async getAllChats(user: any) {
    return this.forward('GET', '/api/chat/chat/all', null, null, user);
  }

  async sendMessage(dto: any, user: any) {
    // Note: If sending multi-part file uploads (images), we may need to forward content-type or forward raw stream.
    // For simplicity, standard json body forwarding is handled here.
    return this.forward('POST', '/api/chat/message', dto, null, user);
  }

  async getMessages(chatId: string, user: any) {
    return this.forward('GET', `/api/chat/message/${chatId}`, null, null, user);
  }
}
