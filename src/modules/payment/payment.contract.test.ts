import 'reflect-metadata';
import assert from 'node:assert/strict';
import test from 'node:test';
import type { HttpService } from '@nestjs/axios';
import { ConflictException, ServiceUnavailableException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';

import type { RequestWithContext } from '../../common/interfaces/request-context.interface';
import { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';
import { CanteenOrderController } from '../canteen/canteen-order.controller';
import type { CanteenService } from '../canteen/canteen.service';
import {
  createQrRequestContext,
  releaseLinksRequestContext,
} from './payment-request-context';
import { PaymentService } from './payment.service';

const USER = { _id: '507f1f77bcf86cd799439012', role: 'user' };
const ORDER_ID = '507f1f77bcf86cd799439011';

function harness(order: Record<string, unknown>) {
  const requests: Array<Record<string, unknown>> = [];
  const signatures: Array<{ target?: string; context?: string }> = [];
  const httpService = {
    axiosRef: {
      request: (config: Record<string, unknown>) => {
        requests.push(config);
        const url = String(config.url);
        return Promise.resolve({
          status: 200,
          data: url.includes('/api/canteen/') ? order : { paymentId: 'p-1' },
        });
      },
    },
  } as unknown as HttpService;
  const signatureService = {
    signUserPayload: (
      payload: string,
      _requestId: string,
      target?: string,
      context?: string,
    ) => {
      signatures.push({ target, context });
      return { 'x-user-payload': payload, 'x-user-signature': 'signed' };
    },
  } as unknown as InternalRequestSignatureService;
  const config = {
    get: (_key: string, fallback?: string) => fallback,
  } as unknown as ConfigService;
  const service = new PaymentService(httpService, config, signatureService, {
    requestContext: { requestId: 'req-1' },
  } as RequestWithContext);
  return { service, requests, signatures };
}

test('tạo link PayOS bằng tổng tiền đọc từ Canteen và ký kèm nội dung đơn', async () => {
  const { service, requests, signatures } = harness({
    userId: USER._id,
    finalAmount: 45_000,
    status: 'CREATED',
    paymentStatus: 'PENDING',
  });

  await service.createPayosLink(ORDER_ID, USER);

  assert.equal(
    requests[0].url,
    `http://localhost:5005/api/canteen/orders/${ORDER_ID}`,
  );
  assert.equal(requests[1].url, 'http://localhost:5006/api/payment/create-qr');
  assert.deepEqual(requests[1].data, {
    orderId: ORDER_ID,
    orderUserId: USER._id,
    amount: 45_000,
  });
  assert.deepEqual(signatures[1], {
    target: 'payment',
    context: createQrRequestContext(ORDER_ID, USER._id, 45_000),
  });
});

test('không tạo link cho đơn đã trả hoặc đã hủy', async () => {
  for (const order of [
    { status: 'COMPLETED', paymentStatus: 'PAID' },
    { status: 'CANCELLED', paymentStatus: 'PENDING' },
  ]) {
    const { service, requests } = harness({
      userId: USER._id,
      finalAmount: 45_000,
      ...order,
    });

    await assert.rejects(
      service.createPayosLink(ORDER_ID, USER),
      ConflictException,
    );
    assert.equal(requests.length, 1);
  }
});

test('chuyển webhook PayOS tới Payment mà không gắn danh tính người dùng', async () => {
  const { service, requests, signatures } = harness({});

  await service.forwardPayosWebhook({ code: '00', data: {}, signature: 'x' });

  assert.equal(
    requests[0].url,
    'http://localhost:5006/api/payment/webhooks/payos',
  );
  assert.equal(
    (requests[0].headers as Record<string, string>)['x-user-payload'],
    undefined,
  );
  assert.equal(signatures.length, 0);
});

test('Gateway từ chối gọi Payment khi thiếu PAYMENT_INTERNAL_SECRET', () => {
  const signer = new InternalRequestSignatureService({
    get: () => undefined,
  } as unknown as ConfigService);

  assert.throws(
    () => signer.signUserPayload('payload', 'req-1', 'payment'),
    ServiceUnavailableException,
  );
});

test('đóng thanh toán online của đơn: gọi Payment với chữ ký gắn mã đơn và lý do', async () => {
  const { service, requests, signatures } = harness({});

  await service.releaseOrderLinks(ORDER_ID, 'ORDER_CANCELLED', USER);

  assert.equal(
    requests[0].url,
    `http://localhost:5006/api/payment/orders/${ORDER_ID}/release-links`,
  );
  assert.equal(requests[0].method, 'POST');
  assert.deepEqual(requests[0].data, { reason: 'ORDER_CANCELLED' });
  assert.deepEqual(signatures[0], {
    target: 'payment',
    context: releaseLinksRequestContext(ORDER_ID, 'ORDER_CANCELLED'),
  });
});

test('Payment lỗi khi đóng thanh toán online không làm hỏng thao tác chính', async () => {
  const { service } = harness({});
  const failing = service as unknown as {
    payment: { post: () => Promise<never> };
  };
  failing.payment.post = () =>
    Promise.reject(new ServiceUnavailableException('payment down'));

  await assert.doesNotReject(
    service.releaseOrderLinks(ORDER_ID, 'PAID_IN_CASH', USER),
  );
});

test('huỷ đơn và thu tiền mặt: Canteen trước, rồi mới đóng thanh toán online', async () => {
  const calls: string[] = [];
  const canteenService = {
    cancelOrder: () => {
      calls.push('canteen:cancel');
      return Promise.resolve({ _id: ORDER_ID, status: 'CANCELLED' });
    },
    confirmCashPayment: () => {
      calls.push('canteen:cash');
      return Promise.resolve({ _id: ORDER_ID, paymentStatus: 'PAID' });
    },
  } as unknown as CanteenService;
  const paymentService = {
    releaseOrderLinks: (orderId: string, reason: string) => {
      calls.push(`payment:${reason}:${orderId}`);
      return Promise.resolve();
    },
  } as unknown as PaymentService;
  const controller = new CanteenOrderController(canteenService, paymentService);
  const req = { user: USER } as never;

  const cancelled = await controller.cancelOrder(ORDER_ID, {} as never, req);
  const paid = await controller.confirmCashPayment(ORDER_ID, req);

  assert.deepEqual(calls, [
    'canteen:cancel',
    `payment:ORDER_CANCELLED:${ORDER_ID}`,
    'canteen:cash',
    `payment:PAID_IN_CASH:${ORDER_ID}`,
  ]);
  assert.deepEqual(cancelled, { _id: ORDER_ID, status: 'CANCELLED' });
  assert.deepEqual(paid, { _id: ORDER_ID, paymentStatus: 'PAID' });
});

test('Canteen từ chối huỷ thì không đụng tới thanh toán online', async () => {
  let released = false;
  const controller = new CanteenOrderController(
    {
      cancelOrder: () => Promise.reject(new ConflictException('đã trả')),
    } as unknown as CanteenService,
    {
      releaseOrderLinks: () => {
        released = true;
        return Promise.resolve();
      },
    } as unknown as PaymentService,
  );

  await assert.rejects(
    controller.cancelOrder(ORDER_ID, {} as never, { user: USER } as never),
    ConflictException,
  );
  assert.equal(released, false);
});
