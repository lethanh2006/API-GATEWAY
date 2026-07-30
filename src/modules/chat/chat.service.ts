import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface UploadedChatImage {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

@Injectable()
export class ChatService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.baseUrl = this.configService.get<string>('CHAT_SERVICE_URL', 'http://localhost:5002');
  }

  private createUserHeaders(user?: any) {
    const headers: Record<string, string> = {};
    if (user) {
      const userPayloadStr = JSON.stringify(user);
      const base64User = Buffer.from(userPayloadStr).toString('base64');
      headers['x-user-payload'] = base64User;
    }
    return headers;
  }

  private async forward(method: string, path: string, data?: any, params?: any, user?: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url: `${this.baseUrl}${path}`,
          data,
          params,
          headers: this.createUserHeaders(user),
        })
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
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

  async sendMessage(dto: any, image: UploadedChatImage | undefined, user: any) {
    const form = new FormData();
    form.append('chatId', dto.chatId);
    if (dto.text) form.append('text', dto.text);
    if (image) {
      const bytes = Uint8Array.from(image.buffer);
      form.append('image', new Blob([bytes], { type: image.mimetype }), image.originalname);
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/api/chat/message`, form, {
          headers: this.createUserHeaders(user),
          maxBodyLength: 6 * 1024 * 1024,
        })
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw error;
    }
  }

  async getMessages(chatId: string, user: any) {
    return this.forward('GET', `/api/chat/message/${chatId}`, null, null, user);
  }
}
