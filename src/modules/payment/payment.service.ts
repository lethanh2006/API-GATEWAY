import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';

import { UpstreamClient } from '../../common/http/upstream-client';
import type {
  GatewayUser,
  RequestWithContext,
} from '../../common/interfaces/request-context.interface';
import { appLogger } from '../../common/logging/logger';
import { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';
import type { PaymentHistoryQueryDto } from './dto/payment-history-query.dto';
import type { RefundQueryDto } from './dto/refund-query.dto';
import type { ResolveRefundDto } from './dto/resolve-refund.dto';
import {
  createQrRequestContext,
  type ReleaseReason,
  releaseLinksRequestContext,
  resolveRefundRequestContext,
} from './payment-request-context';

const PAYMENT = '/api/payment';

interface CanteenOrder {
  userId?: unknown;
  finalAmount?: unknown;
  status?: unknown;
  paymentStatus?: unknown;
}

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  private readonly canteen: UpstreamClient;
  private readonly payment: UpstreamClient;

  constructor(
    httpService: HttpService,
    configService: ConfigService,
    signatureService: InternalRequestSignatureService,
    @Inject(REQUEST) request: RequestWithContext,
  ) {
    this.canteen = new UpstreamClient({
      httpService,
      signatureService,
      request,
      service: 'canteen',
      baseUrl: configService.get<string>(
        'CANTEEN_SERVICE_URL',
        'http://localhost:5005',
      ),
      label: 'Dịch vụ căn tin',
      signRoute: false,
    });
    this.payment = new UpstreamClient({
      httpService,
      signatureService,
      request,
      service: 'payment',
      baseUrl: configService.get<string>(
        'PAYMENT_SERVICE_URL',
        'http://localhost:5006',
      ),
      label: 'Dịch vụ thanh toán',
      // Payment chỉ ký danh tính, riêng route tạo link ký thêm nội dung đơn.
      signRoute: false,
    });
  }

  /** Đọc đơn từ Canteen bằng quyền của người gọi, rồi tạo link PayOS đúng tổng tiền của đơn. */
  async createPayosLink(orderId: string, user: GatewayUser) {
    const order = (await this.canteen.get(
      `/api/canteen/orders/${encodeURIComponent(orderId)}`,
      { user },
    )) as CanteenOrder;
    if (
      typeof order?.userId !== 'string' ||
      !Number.isSafeInteger(order.finalAmount)
    ) {
      throw new BadGatewayException('Dịch vụ căn tin trả về đơn không hợp lệ');
    }
    if (order.status !== 'CREATED' || order.paymentStatus !== 'PENDING') {
      throw new ConflictException('Đơn hàng không còn chờ thanh toán');
    }

    const amount = order.finalAmount as number;
    return this.payment.post(
      `${PAYMENT}/create-qr`,
      { orderId, orderUserId: order.userId, amount },
      {
        user,
        signatureContext: createQrRequestContext(orderId, order.userId, amount),
      },
    );
  }

  /**
   * Gọi sau khi Canteen đã huỷ đơn hoặc đã thu tiền mặt: Payment đóng thanh toán online của đơn và
   * huỷ link PayOS còn mở. Không bao giờ ném lỗi, vì thao tác chính đã xong; Payment lỗi thì link cũ
   * hết hạn sau tối đa 15 phút, tiền lỡ về được đối soát để hoàn.
   */
  async releaseOrderLinks(
    orderId: string,
    reason: ReleaseReason,
    user: GatewayUser,
  ): Promise<void> {
    try {
      await this.payment.post(
        `${PAYMENT}/orders/${encodeURIComponent(orderId)}/release-links`,
        { reason },
        { user, signatureContext: releaseLinksRequestContext(orderId, reason) },
      );
    } catch (error: unknown) {
      appLogger.warn(
        {
          'event.name': 'payment.links.release_failed',
          'order.id': orderId,
          'payment.release_reason': reason,
          'error.message':
            error instanceof Error ? error.message : String(error),
        },
        'Không đóng được thanh toán online của đơn; link cũ còn mở tới khi hết hạn',
      );
    }
  }

  listRefunds(query: RefundQueryDto, user: GatewayUser) {
    return this.payment.get(`${PAYMENT}/refunds`, { params: query, user });
  }

  resolveRefund(caseId: string, dto: ResolveRefundDto, user: GatewayUser) {
    return this.payment.post(
      `${PAYMENT}/refunds/${encodeURIComponent(caseId)}/resolve`,
      dto,
      {
        user,
        signatureContext: resolveRefundRequestContext(caseId, dto.outcome),
      },
    );
  }

  getLatestForOrder(orderId: string, user: GatewayUser) {
    return this.payment.get(
      `${PAYMENT}/orders/${encodeURIComponent(orderId)}`,
      { user },
    );
  }

  getPayment(paymentId: string, user: GatewayUser) {
    return this.payment.get(
      `${PAYMENT}/payments/${encodeURIComponent(paymentId)}`,
      { user },
    );
  }

  getHistory(query: PaymentHistoryQueryDto, user: GatewayUser) {
    return this.payment.get(`${PAYMENT}/history`, { params: query, user });
  }

  forwardPayosWebhook(payload: unknown) {
    return this.payment.post(`${PAYMENT}/webhooks/payos`, payload);
  }
}
