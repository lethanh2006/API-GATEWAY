import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import FormData from 'form-data';
import { firstValueFrom } from 'rxjs';

import { UpstreamClient } from '../../common/http/upstream-client';
import { throwUpstreamError } from '../../common/http/upstream-error';
import type {
  GatewayUser,
  RequestWithContext,
} from '../../common/interfaces/request-context.interface';
import { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';
import type { CreateChatDto } from './dto/create-chat.dto';
import type { SendMessageDto } from './dto/send-message.dto';

const LABEL = 'Dịch vụ trò chuyện';
const MESSAGE_PATH = '/api/chat/message';
const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;
const UPLOAD_TIMEOUT_MS = 55_000;

export interface UploadedChatImage {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export interface ProxiedChatResponse {
  statusCode: number;
  body: unknown;
}

@Injectable({ scope: Scope.REQUEST })
export class ChatService {
  private readonly baseUrl: string;
  private readonly upstream: UpstreamClient;

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
    @Inject(REQUEST) request: RequestWithContext,
    signatureService: InternalRequestSignatureService,
  ) {
    this.baseUrl = configService.get<string>(
      'CHAT_SERVICE_URL',
      'http://localhost:5002',
    );
    this.upstream = new UpstreamClient({
      httpService,
      signatureService,
      request,
      service: 'chat',
      baseUrl: this.baseUrl,
      label: LABEL,
    });
  }

  /** Giữ nguyên status code của upstream vì tạo chat trả 201 hoặc 200. */
  async createChat(
    dto: CreateChatDto,
    user: GatewayUser,
  ): Promise<ProxiedChatResponse> {
    const response = await this.upstream.send('POST', '/api/chat/chat/new', {
      data: dto,
      user,
    });
    return { statusCode: response.status, body: response.data };
  }

  getAllChats(user: GatewayUser) {
    return this.upstream.get('/api/chat/chat/all', { user });
  }

  async sendMessage(
    dto: SendMessageDto,
    image: UploadedChatImage | undefined,
    user: GatewayUser,
  ) {
    if (!image) return this.upstream.post(MESSAGE_PATH, dto, { user });

    const form = new FormData();
    form.append('chatId', dto.chatId);
    if (dto.text) form.append('text', dto.text);
    form.append('image', image.buffer, {
      filename: image.originalname || 'chat-image.jpg',
      contentType: image.mimetype || 'image/jpeg',
      knownLength: image.buffer.length,
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}${MESSAGE_PATH}`, form, {
          headers: {
            ...form.getHeaders(),
            ...this.upstream.headers('POST', MESSAGE_PATH, user),
          },
          maxBodyLength: MAX_UPLOAD_BYTES,
          maxContentLength: MAX_UPLOAD_BYTES,
          timeout: UPLOAD_TIMEOUT_MS,
        }),
      );
      return response.data;
    } catch (error: unknown) {
      throwUpstreamError(error, LABEL);
    }
  }

  getMessages(chatId: string, user: GatewayUser) {
    return this.upstream.get(
      `/api/chat/message/${encodeURIComponent(chatId)}`,
      { user },
    );
  }
}
