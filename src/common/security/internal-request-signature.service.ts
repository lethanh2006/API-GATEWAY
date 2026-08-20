import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

@Injectable()
export class InternalRequestSignatureService {
  private readonly secrets: Record<InternalService, string | undefined>;
  private readonly production: boolean;

  constructor(configService: ConfigService) {
    this.secrets = {
      canteen: configService.get<string>('CANTEEN_INTERNAL_SECRET')?.trim(),
      payment: configService.get<string>('PAYMENT_INTERNAL_SECRET')?.trim(),
    };
    this.production = configService.get<string>('NODE_ENV') === 'production';
  }

  signUserPayload(
    payload: string,
    requestId: string,
    target: InternalService = 'canteen',
  ): Record<string, string> {
    const secret = this.secrets[target];
    if (!secret || (this.production && secret.length < 32)) {
      if (this.production) {
        throw new ServiceUnavailableException(
          `Gateway chưa được cấu hình để gọi dịch vụ ${target}`,
        );
      }
      return { 'x-user-payload': payload };
    }

    const timestamp = Date.now().toString();
    const signature = createHmac('sha256', secret)
      .update(`${timestamp}.${requestId}.${payload}`)
      .digest('hex');

    return {
      'x-user-payload': payload,
      'x-user-timestamp': timestamp,
      'x-user-signature': signature,
    };
  }
}

export type InternalService = 'canteen' | 'payment';
