import assert from 'node:assert/strict';
import test from 'node:test';
import type { HttpService } from '@nestjs/axios';
import { ServiceUnavailableException } from '@nestjs/common';
import { AxiosError, type AxiosResponse } from 'axios';

import type {
  GatewayUser,
  RequestWithContext,
} from '../interfaces/request-context.interface';
import type { InternalRequestSignatureService } from '../security/internal-request-signature.service';
import { UpstreamClient } from './upstream-client';
import {
  UpstreamHttpException,
  UpstreamTransportException,
} from './upstream-error';

const USER: GatewayUser = { _id: 'user-1', role: 'admin' };

function createHarness(
  options: {
    respond?: (config: Record<string, unknown>) => Promise<unknown>;
    request?: RequestWithContext;
    signRoute?: boolean;
    signUserPayload?: InternalRequestSignatureService['signUserPayload'];
  } = {},
) {
  const requests: Array<Record<string, unknown>> = [];
  const signatures: Array<{
    payload: string;
    requestId: string;
    target?: string;
    context?: string;
  }> = [];
  const httpService = {
    axiosRef: {
      request: async (config: Record<string, unknown>) => {
        requests.push(config);
        return (
          (await options.respond?.(config)) ?? { status: 200, data: { ok: 1 } }
        );
      },
    },
  } as unknown as HttpService;
  const signatureService = {
    signUserPayload:
      options.signUserPayload ??
      ((
        payload: string,
        requestId: string,
        target?: string,
        context?: string,
      ) => {
        signatures.push({ payload, requestId, target, context });
        return { 'x-user-payload': payload, 'x-user-signature': 'signed' };
      }),
  } as unknown as InternalRequestSignatureService;
  const request =
    options.request ??
    ({ requestContext: { requestId: 'req-1' } } as RequestWithContext);

  return {
    client: new UpstreamClient({
      httpService,
      signatureService,
      request,
      service: 'todo',
      baseUrl: 'http://todo.test',
      label: 'Dịch vụ công việc',
      signRoute: options.signRoute,
    }),
    request,
    requests,
    signatures,
  };
}

test('anonymous calls carry only the request id and an explicit empty body/query', async () => {
  const { client, requests, signatures } = createHarness();

  assert.deepEqual(await client.get('/api/todo/overdue'), { ok: 1 });

  assert.deepEqual(requests, [
    {
      method: 'GET',
      url: 'http://todo.test/api/todo/overdue',
      data: null,
      params: null,
      headers: { 'x-request-id': 'req-1' },
    },
  ]);
  assert.equal(signatures.length, 0);
});

test('authenticated calls sign the base64 identity for the upstream and route', async () => {
  const { client, requests, signatures } = createHarness();

  await client.patch('/api/todo/42/status', { status: 'done' }, { user: USER });

  assert.equal(signatures.length, 1);
  assert.deepEqual(
    JSON.parse(Buffer.from(signatures[0].payload, 'base64').toString('utf8')),
    USER,
  );
  assert.equal(signatures[0].requestId, 'req-1');
  assert.equal(signatures[0].target, 'todo');
  assert.equal(signatures[0].context, 'PATCH:/api/todo/42/status');
  assert.deepEqual(requests[0].headers, {
    'x-request-id': 'req-1',
    'x-user-payload': signatures[0].payload,
    'x-user-signature': 'signed',
  });
  assert.deepEqual(requests[0].data, { status: 'done' });
});

test('signRoute=false signs the identity without binding it to the route', async () => {
  const { client, signatures } = createHarness({ signRoute: false });

  await client.get('/api/canteen/orders', { user: USER });

  assert.equal(signatures[0].context, undefined);
});

test('verbs place the body and query string in the right argument', async () => {
  const { client, requests } = createHarness();
  const query = { page: 2 };

  await client.get('/a', { params: query });
  await client.delete('/b');
  await client.post('/c', { n: 1 });
  await client.put('/d', { n: 2 });
  await client.patch('/e', { n: 3 });

  assert.deepEqual(
    requests.map(({ method, data, params }) => ({ method, data, params })),
    [
      { method: 'GET', data: null, params: query },
      { method: 'DELETE', data: null, params: null },
      { method: 'POST', data: { n: 1 }, params: null },
      { method: 'PUT', data: { n: 2 }, params: null },
      { method: 'PATCH', data: { n: 3 }, params: null },
    ],
  );
});

test('generates a request id when the request has no context and reuses it for signing', async () => {
  const { client, requests, signatures } = createHarness({
    request: {} as RequestWithContext,
  });

  await client.get('/api/todo/overdue', { user: USER });

  const requestId = (requests[0].headers as Record<string, string>)[
    'x-request-id'
  ];
  assert.match(requestId, /^[0-9a-f-]{36}$/);
  assert.equal(signatures[0].requestId, requestId);
});

test('send returns the whole response so callers can keep the status code', async () => {
  const { client } = createHarness({
    respond: () => Promise.resolve({ status: 201, data: { created: true } }),
  });

  const response = await client.send('POST', '/api/chat/chat/new', {
    data: { a: 1 },
    user: USER,
  });

  assert.equal(response.status, 201);
  assert.deepEqual(response.data, { created: true });
});

test('records upstream latency for successful and failed calls', async () => {
  const ok = createHarness();
  await ok.client.get('/ok');
  assert.equal(typeof ok.request.requestContext?.perf?.upstreamMs, 'number');

  const failed = createHarness({
    respond: () => Promise.reject(new Error('socket hang up')),
  });
  await assert.rejects(failed.client.get('/boom'));
  assert.equal(
    typeof failed.request.requestContext?.perf?.upstreamMs,
    'number',
  );
});

test('maps an upstream HTTP error to the Gateway error format', async () => {
  const response = {
    status: 404,
    data: { message: 'Không tìm thấy công việc' },
  } as AxiosResponse;
  const { client } = createHarness({
    respond: () =>
      Promise.reject(
        new AxiosError('failed', 'ERR_BAD_REQUEST', undefined, {}, response),
      ),
  });

  await assert.rejects(client.get('/api/todo/missing'), (error: unknown) => {
    assert.ok(error instanceof UpstreamHttpException);
    assert.equal(error.getStatus(), 404);
    assert.equal(error.originService, 'Dịch vụ công việc');
    return true;
  });
});

test('maps a transport failure to 502 UPSTREAM_UNAVAILABLE', async () => {
  const { client } = createHarness({
    respond: () => Promise.reject(new Error('connect ECONNREFUSED')),
  });

  await assert.rejects(client.get('/api/todo/overdue'), (error: unknown) => {
    assert.ok(error instanceof UpstreamTransportException);
    assert.equal(error.getStatus(), 502);
    assert.equal(
      (error.getResponse() as { code: string }).code,
      'UPSTREAM_UNAVAILABLE',
    );
    return true;
  });
});

test('a signing misconfiguration surfaces as-is and nothing is sent upstream', async () => {
  const { client, requests } = createHarness({
    signUserPayload: () => {
      throw new ServiceUnavailableException('Gateway chưa được cấu hình');
    },
  });

  await assert.rejects(
    client.get('/api/todo/overdue', { user: USER }),
    ServiceUnavailableException,
  );
  assert.equal(requests.length, 0);
});
