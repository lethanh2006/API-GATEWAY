import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

@Injectable()
export class InternalRequestSignatureService {
  private readonly secrets: Record<InternalService, string | undefined>;
  private readonly production: boolean;

  constructor(configService: ConfigService) {
    this.secrets = {
      auth:
        configService.get<string>('AUTH_INTERNAL_SECRET')?.trim() ||
        configService.get<string>('JWT_SECRET')?.trim(),
      canteen: configService.get<string>('CANTEEN_INTERNAL_SECRET')?.trim(),
      payment: configService.get<string>('PAYMENT_INTERNAL_SECRET')?.trim(),
      user:
        configService.get<string>('USER_INTERNAL_SECRET')?.trim() ||
        configService.get<string>('JWT_SECRET')?.trim(),
    };
    this.production = configService.get<string>('NODE_ENV') === 'production';
  }

  signUserPayload(
    payload: string,
    requestId: string,
    target: InternalService = 'canteen',
    context?: string,
  ): Record<string, string> {
    const secret = this.secrets[target];
    const signatureRequired =
      this.production || target === 'auth' || target === 'user';
    if (!secret || (signatureRequired && Buffer.byteLength(secret) < 32)) {
      if (signatureRequired) {
        throw new ServiceUnavailableException(
          `Gateway chưa được cấu hình để gọi dịch vụ ${target}`,
        );
      }
      return { 'x-user-payload': payload };
    }

    const timestamp = Date.now().toString();
    const signedMessage = context
      ? `${timestamp}.${requestId}.${payload}.${context}`
      : `${timestamp}.${requestId}.${payload}`;
    const signature = createHmac('sha256', secret)
      .update(signedMessage)
      .digest('hex');

    return {
      'x-user-payload': payload,
      'x-user-timestamp': timestamp,
      'x-user-signature': signature,
    };
  }
}

export type InternalService = 'auth' | 'canteen' | 'payment' | 'user';
