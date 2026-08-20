import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  Scope,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { randomUUID } from 'node:crypto';
import { firstValueFrom } from 'rxjs';
import type { RequestWithContext } from '../../common/interfaces/request-context.interface';
import { throwUpstreamError } from '../../common/http/upstream-error';
import { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';
import { createQrRequestContext } from './payment-request-context';

interface GatewayUser {
  _id?: string;
  id?: string;
  role?: string;
}

interface CanteenOrder {
  _id?: string;
  userId?: unknown;
  finalAmount?: unknown;
  status?: unknown;
  paymentStatus?: unknown;
  paymentMethod?: unknown;
}

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly paymentUrl: string;
  private readonly canteenUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly signatureService: InternalRequestSignatureService,
    @Inject(REQUEST) private readonly request: RequestWithContext,
  ) {
    this.paymentUrl = this.configService.get<string>(
      'PAYMENT_SERVICE_URL',
      'http://localhost:5006',
    );
    this.canteenUrl = this.configService.get<string>(
      'CANTEEN_SERVICE_URL',
      'http://localhost:5005',
    );
  }

  async createQr(orderId: string, user: GatewayUser) {
    const order = await this.getAuthoritativeOrder(orderId, user);
    this.assertOrderCanBePaid(order, user);

    const amount = Number(order.finalAmount);
    return this.forwardPayment(
      'POST',
      '/api/payment/create-qr',
      { orderId, amount },
      undefined,
      user,
      createQrRequestContext(orderId, amount),
    );
  }

  async getLatestForOrder(orderId: string, user: GatewayUser) {
    return this.forwardPayment(
      'GET',
      `/api/payment/orders/${orderId}`,
      undefined,
      undefined,
      user,
    );
  }

  async getPayment(paymentId: string, user: GatewayUser) {
    return this.forwardPayment(
      'GET',
      `/api/payment/payments/${paymentId}`,
      undefined,
      undefined,
      user,
    );
  }

  async getHistory(limit: number, user: GatewayUser) {
    return this.forwardPayment(
      'GET',
      '/api/payment/history',
      undefined,
      { limit },
      user,
    );
  }

  async forwardCassoWebhook(payload: unknown, signature: string | undefined) {
    const requestId = this.requestId();
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.paymentUrl}/api/payment/webhooks/casso`,
          payload,
          {
            headers: {
              'content-type': 'application/json',
              'x-request-id': requestId,
              ...(signature ? { 'x-casso-signature': signature } : {}),
            },
          },
        ),
      );
      return response.data;
    } catch (error: unknown) {
      throwUpstreamError(error, 'Dịch vụ thanh toán', this.logger);
    }
  }

  private async getAuthoritativeOrder(
    orderId: string,
    user: GatewayUser,
  ): Promise<CanteenOrder> {
    const requestId = this.requestId();
    try {
      const response = await firstValueFrom(
        this.httpService.get<CanteenOrder>(
          `${this.canteenUrl}/api/canteen/orders/${orderId}`,
          { headers: this.signedUserHeaders(user, requestId, 'canteen') },
        ),
      );
      return response.data;
    } catch (error: unknown) {
      throwUpstreamError(error, 'Dịch vụ căn tin', this.logger);
    }
  }

  private assertOrderCanBePaid(order: CanteenOrder, user: GatewayUser): void {
    const userId = user._id ?? user.id;
    const ownerId = this.idString(order.userId);
    const privileged = new Set(['admin', 'manager', 'cashier']).has(
      user.role?.toLowerCase() ?? '',
    );
    if (!userId || (!privileged && ownerId !== userId)) {
      throw new ForbiddenException(
        'Bạn không có quyền thanh toán đơn hàng này',
      );
    }
    if (order.status === 'CANCELLED') {
      throw new ConflictException('Đơn hàng đã bị hủy');
    }
    if (order.paymentStatus === 'PAID') {
      throw new ConflictException('Đơn hàng đã được thanh toán');
    }
    if (order.paymentMethod !== 'VIETQR') {
      throw new ConflictException(
        'Đơn hàng không sử dụng phương thức thanh toán VIETQR',
      );
    }
    if (
      !Number.isSafeInteger(order.finalAmount) ||
      Number(order.finalAmount) <= 0
    ) {
      throw new ConflictException(
        'Số tiền đơn hàng không hợp lệ để tạo VietQR',
      );
    }
  }

  private async forwardPayment(
    method: string,
    path: string,
    data: unknown,
    params: unknown,
    user: GatewayUser,
    signatureContext?: string,
  ) {
    const requestId = this.requestId();
    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url: `${this.paymentUrl}${path}`,
          data,
          params,
          headers: this.signedUserHeaders(
            user,
            requestId,
            'payment',
            signatureContext,
          ),
        }),
      );
      return response.data;
    } catch (error: unknown) {
      throwUpstreamError(error, 'Dịch vụ thanh toán', this.logger);
    }
  }

  private signedUserHeaders(
    user: GatewayUser,
    requestId: string,
    target: 'canteen' | 'payment',
    signatureContext?: string,
  ): Record<string, string> {
    const payload = Buffer.from(JSON.stringify(user)).toString('base64');
    return {
      'x-request-id': requestId,
      ...this.signatureService.signUserPayload(
        payload,
        requestId,
        target,
        signatureContext,
      ),
    };
  }

  private requestId(): string {
    return this.request.requestContext?.requestId ?? randomUUID();
  }

  private idString(value: unknown): string | null {
    if (typeof value === 'string') {
      return value;
    }
    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>;
      if (typeof record._id === 'string') {
        return record._id;
      }
      if (typeof record.toString === 'function') {
        const serialized = record.toString();
        return serialized === '[object Object]' ? null : serialized;
      }
    }
    return null;
  }
}
