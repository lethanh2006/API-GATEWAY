import assert from 'node:assert/strict';
import test from 'node:test';
import type { HttpService } from '@nestjs/axios';
import { ConflictException, ForbiddenException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import type { RequestWithContext } from '../../common/interfaces/request-context.interface';
import type { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';
import { PaymentService } from './payment.service';

interface TestOrder {
  _id: string;
  userId: unknown;
  finalAmount: unknown;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
}

interface SignatureCall {
  payload: string;
  requestId: string;
  target: 'canteen' | 'payment';
  context?: string;
}

const validOrder: TestOrder = {
  _id: 'order-123',
  userId: 'user-123',
  finalAmount: 125_000,
  status: 'PENDING',
  paymentStatus: 'UNPAID',
  paymentMethod: 'VIETQR',
};

function createHarness(order: TestOrder = validOrder) {
  const getCalls: Array<{ url: string; options: unknown }> = [];
  const requestCalls: Array<Record<string, unknown>> = [];
  const postCalls: Array<{
    url: string;
    payload: unknown;
    options: Record<string, unknown>;
  }> = [];
  const signatureCalls: SignatureCall[] = [];

  const httpService = {
    get: (url: string, options: unknown) => {
      getCalls.push({ url, options });
      return of({ data: order });
    },
    request: (options: Record<string, unknown>) => {
      requestCalls.push(options);
      return of({ data: { paymentId: 'payment-123' } });
    },
    post: (url: string, payload: unknown, options: Record<string, unknown>) => {
      postCalls.push({ url, payload, options });
      return of({ data: { success: true } });
    },
  } as unknown as HttpService;

  const configService = {
    get: (key: string, fallback?: string) => {
      const values: Record<string, string> = {
        PAYMENT_SERVICE_URL: 'http://payment.test',
        CANTEEN_SERVICE_URL: 'http://canteen.test',
      };
      return values[key] ?? fallback;
    },
  } as unknown as ConfigService;

  const signatureService = {
    signUserPayload: (
      payload: string,
      requestId: string,
      target: 'canteen' | 'payment',
      context?: string,
    ) => {
      signatureCalls.push({ payload, requestId, target, context });
      return {
        'x-user-payload': payload,
        'x-user-timestamp': '1700000000000',
        'x-user-signature': `signature-for-${target}`,
      };
    },
  } as unknown as InternalRequestSignatureService;

  const request = {
    requestContext: {
      requestId: 'request-123',
      startedAt: process.hrtime.bigint(),
    },
  } as RequestWithContext;

  return {
    service: new PaymentService(
      httpService,
      configService,
      signatureService,
      request,
    ),
    getCalls,
    requestCalls,
    postCalls,
    signatureCalls,
  };
}

test('luôn lấy số tiền chính thức từ Canteen trước khi tạo QR', async () => {
  const harness = createHarness({ ...validOrder, finalAmount: 347_000 });
  const user = { _id: 'user-123', role: 'customer' };

  const result = await harness.service.createQr('order-123', user);

  assert.deepEqual(result, { paymentId: 'payment-123' });
  assert.equal(harness.getCalls.length, 1);
  assert.equal(
    harness.getCalls[0]?.url,
    'http://canteen.test/api/canteen/orders/order-123',
  );
  assert.equal(harness.requestCalls.length, 1);
  assert.deepEqual(harness.requestCalls[0]?.data, {
    orderId: 'order-123',
    orderUserId: 'user-123',
    amount: 347_000,
  });
});

test('chỉ chủ đơn hoặc vai trò đặc quyền mới được tạo QR', async (t) => {
  await t.test('từ chối người dùng không sở hữu đơn', async () => {
    const harness = createHarness();

    await assert.rejects(
      harness.service.createQr('order-123', {
        _id: 'another-user',
        role: 'customer',
      }),
      (error: unknown) => {
        assert.ok(error instanceof ForbiddenException);
        assert.match(error.message, /không có quyền thanh toán/);
        return true;
      },
    );
    assert.equal(harness.requestCalls.length, 0);
  });

  for (const role of ['admin', 'manager', 'cashier']) {
    await t.test(`cho phép vai trò ${role}`, async () => {
      const harness = createHarness();

      await harness.service.createQr('order-123', {
        _id: 'another-user',
        role,
      });

      assert.equal(harness.requestCalls.length, 1);
      assert.deepEqual(harness.requestCalls[0]?.data, {
        orderId: 'order-123',
        orderUserId: 'user-123',
        amount: 125_000,
      });
    });
  }
});

test('từ chối đơn không còn đủ điều kiện thanh toán', async (t) => {
  const cases: Array<{
    name: string;
    order: Partial<TestOrder>;
    expectedMessage: RegExp;
  }> = [
    {
      name: 'đã hủy',
      order: { status: 'CANCELLED' },
      expectedMessage: /đã bị hủy/,
    },
    {
      name: 'đã thanh toán',
      order: { paymentStatus: 'PAID' },
      expectedMessage: /đã được thanh toán/,
    },
    {
      name: 'không dùng VIETQR',
      order: { paymentMethod: 'CASH' },
      expectedMessage: /không sử dụng phương thức thanh toán VIETQR/,
    },
  ];

  for (const scenario of cases) {
    await t.test(scenario.name, async () => {
      const harness = createHarness({ ...validOrder, ...scenario.order });

      await assert.rejects(
        harness.service.createQr('order-123', {
          _id: 'user-123',
          role: 'customer',
        }),
        (error: unknown) => {
          assert.ok(error instanceof ConflictException);
          assert.match(error.message, scenario.expectedMessage);
          return true;
        },
      );
      assert.equal(harness.requestCalls.length, 0);
    });
  }
});

test('ký riêng yêu cầu đến Canteen và Payment rồi chỉ forward dữ liệu đã kiểm tra', async () => {
  const harness = createHarness();
  const user = { id: 'user-123', role: 'customer' };

  await harness.service.createQr('order-123', user);

  assert.deepEqual(
    harness.signatureCalls.map(({ requestId, target, context }) => ({
      requestId,
      target,
      context,
    })),
    [
      {
        requestId: 'request-123',
        target: 'canteen',
        context: undefined,
      },
      {
        requestId: 'request-123',
        target: 'payment',
        context:
          '["payment.create-qr.v2","order-123","user-123",125000]',
      },
    ],
  );
  for (const call of harness.signatureCalls) {
    assert.deepEqual(
      JSON.parse(Buffer.from(call.payload, 'base64').toString('utf8')),
      user,
    );
  }
  assert.deepEqual(harness.requestCalls[0], {
    method: 'POST',
    url: 'http://payment.test/api/payment/create-qr',
    data: {
      orderId: 'order-123',
      orderUserId: 'user-123',
      amount: 125_000,
    },
    params: undefined,
    headers: {
      'x-request-id': 'request-123',
      'x-user-payload': harness.signatureCalls[1]?.payload,
      'x-user-timestamp': '1700000000000',
      'x-user-signature': 'signature-for-payment',
    },
  });
});

test('giữ nguyên chữ ký Casso khi forward webhook sang Payment', async () => {
  const harness = createHarness();
  const payload = { id: 99, data: [{ amount: 125_000 }] };

  const result = await harness.service.forwardCassoWebhook(
    payload,
    't=1700000000000,v1=casso-signature',
  );

  assert.deepEqual(result, { success: true });
  assert.deepEqual(harness.postCalls, [
    {
      url: 'http://payment.test/api/payment/webhooks/casso',
      payload,
      options: {
        headers: {
          'content-type': 'application/json',
          'x-request-id': 'request-123',
          'x-casso-signature': 't=1700000000000,v1=casso-signature',
        },
      },
    },
  ]);
  assert.equal(harness.signatureCalls.length, 0);
});
