import 'reflect-metadata';
import assert from 'node:assert/strict';
import test from 'node:test';
import type { HttpService } from '@nestjs/axios';
import type { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';
import type { RequestWithContext } from '../../common/interfaces/request-context.interface';
import { MyTaskQueryDto, type TaskQueryDto } from './dto/task-query.dto';
import { UpdateTaskDeadlineDto } from './dto/update-task-deadline.dto';
import { UpdateTaskPriorityDto } from './dto/update-task-priority.dto';
import { UpdateTaskProgressDto } from './dto/update-task-progress.dto';
import { UpcomingDeadlineQueryDto } from './dto/upcoming-deadline-query.dto';
import { TodoService } from './todo.service';

const USER_ID = '507f1f77bcf86cd799439012';
const OTHER_USER_ID = '507f1f77bcf86cd799439013';

interface SignatureCall {
  context?: string;
  payload: string;
  requestId: string;
  target: string;
}

function createHarness() {
  const requestCalls: Array<Record<string, unknown>> = [];
  const signatureCalls: SignatureCall[] = [];
  const httpService = {
    axiosRef: {
      request: (options: Record<string, unknown>) => {
        requestCalls.push(options);
        return Promise.resolve({ data: { ok: true } });
      },
    },
  } as unknown as HttpService;
  const configService = {
    get: (key: string, fallback?: string) =>
      key === 'TODO_SERVICE_URL' ? 'http://todo.test' : fallback,
  } as unknown as ConfigService;
  const request = {
    requestContext: {
      requestId: 'request-todo-123',
    },
  } as RequestWithContext;
  const signatureService = {
    signUserPayload: (
      payload: string,
      requestId: string,
      target: string,
      context?: string,
    ) => {
      signatureCalls.push({ context, payload, requestId, target });
      return {
        'x-user-payload': payload,
        'x-user-signature': 'todo-signature',
        'x-user-timestamp': '1700000000000',
      };
    },
  } as unknown as InternalRequestSignatureService;

  return {
    requestCalls,
    service: new TodoService(
      httpService,
      configService,
      request,
      signatureService,
    ),
    signatureCalls,
  };
}

test('forward bộ lọc và phân trang danh sách cá nhân đúng hợp đồng', async () => {
  const harness = createHarness();
  const user = { _id: USER_ID, role: 'waiter' };
  const query = {
    status: 'in_progress',
    priority: 'high',
    search: 'bàn 3',
    page: 2,
    limit: 5,
  } as MyTaskQueryDto;

  await harness.service.getMyTasks(query, user);

  assert.deepEqual(harness.requestCalls, [
    {
      method: 'GET',
      url: 'http://todo.test/api/todo/my-tasks',
      data: null,
      params: query,
      headers: {
        'x-request-id': 'request-todo-123',
        'x-user-payload': harness.signatureCalls[0]?.payload,
        'x-user-signature': 'todo-signature',
        'x-user-timestamp': '1700000000000',
      },
    },
  ]);
  assert.deepEqual(
    JSON.parse(
      Buffer.from(harness.signatureCalls[0]?.payload ?? '', 'base64').toString(
        'utf8',
      ),
    ),
    user,
  );
  assert.deepEqual(harness.signatureCalls[0], {
    context: 'GET:/api/todo/my-tasks',
    payload: harness.signatureCalls[0]?.payload,
    requestId: 'request-todo-123',
    target: 'todo',
  });
});

test('forward đầy đủ bộ lọc quản trị', async () => {
  const harness = createHarness();
  const user = { _id: USER_ID, role: 'manager' };
  const query = {
    assignedTo: OTHER_USER_ID,
    createdBy: USER_ID,
    status: 'todo',
    page: 1,
    limit: 20,
  } as TaskQueryDto;

  await harness.service.getAllTasks(query, user);

  assert.deepEqual(harness.requestCalls[0], {
    method: 'GET',
    url: 'http://todo.test/api/todo',
    data: null,
    params: query,
    headers: {
      'x-request-id': 'request-todo-123',
      'x-user-payload': harness.signatureCalls[0]?.payload,
      'x-user-signature': 'todo-signature',
      'x-user-timestamp': '1700000000000',
    },
  });
  assert.equal(harness.signatureCalls[0]?.context, 'GET:/api/todo');
});

test('mã hóa id khi forward API chi tiết và cập nhật nội dung', async () => {
  const harness = createHarness();
  const user = { _id: USER_ID, role: 'manager' };

  await harness.service.getTaskById('id/co-slash', user);
  await harness.service.updateTask(
    'id/co-slash',
    { title: 'Báo cáo đã sửa', description: null },
    user,
  );

  assert.deepEqual(
    harness.requestCalls.map(({ method, url, data, params }) => ({
      method,
      url,
      data,
      params,
    })),
    [
      {
        method: 'GET',
        url: 'http://todo.test/api/todo/id%2Fco-slash',
        data: null,
        params: null,
      },
      {
        method: 'PATCH',
        url: 'http://todo.test/api/todo/id%2Fco-slash',
        data: { title: 'Báo cáo đã sửa', description: null },
        params: null,
      },
    ],
  );
  assert.deepEqual(
    harness.signatureCalls.map(({ context }) => context),
    ['GET:/api/todo/id%2Fco-slash', 'PATCH:/api/todo/id%2Fco-slash'],
  );
});

test('DTO danh sách cá nhân loại bỏ bộ lọc quản trị', async () => {
  const query = plainToInstance(MyTaskQueryDto, {
    assignedTo: OTHER_USER_ID,
    createdBy: USER_ID,
    page: '2',
    search: '  bếp  ',
  });

  assert.deepEqual(await validate(query, { whitelist: true }), []);
  assert.equal(query.page, 2);
  assert.equal(query.search, 'bếp');
  assert.equal('assignedTo' in query, false);
  assert.equal('createdBy' in query, false);
});

test('API Todo mới chuyển đúng payload, query và chữ ký theo method/path', async () => {
  const harness = createHarness();
  const user = { _id: USER_ID, role: 'manager' };
  const deadline = '2026-12-31T23:59:59.000Z';

  await harness.service.updateTaskPriority('id/co-slash', 'urgent', user);
  await harness.service.updateTaskDeadline('id/co-slash', deadline, user);
  await harness.service.updateTaskProgress('id/co-slash', 75, user);
  await harness.service.getOverdue(user);
  await harness.service.getUpcomingDeadline({ days: 7 }, user);

  assert.deepEqual(
    harness.requestCalls.map(({ method, url, data, params }) => ({
      method,
      url,
      data,
      params,
    })),
    [
      {
        method: 'PATCH',
        url: 'http://todo.test/api/todo/id%2Fco-slash/priority',
        data: { priority: 'urgent' },
        params: null,
      },
      {
        method: 'PATCH',
        url: 'http://todo.test/api/todo/id%2Fco-slash/deadline',
        data: { deadline },
        params: null,
      },
      {
        method: 'PATCH',
        url: 'http://todo.test/api/todo/id%2Fco-slash/progress',
        data: { progress: 75 },
        params: null,
      },
      {
        method: 'GET',
        url: 'http://todo.test/api/todo/overdue',
        data: null,
        params: null,
      },
      {
        method: 'GET',
        url: 'http://todo.test/api/todo/upcoming-deadline',
        data: null,
        params: { days: 7 },
      },
    ],
  );
  assert.deepEqual(
    harness.signatureCalls.map(({ context }) => context),
    [
      'PATCH:/api/todo/id%2Fco-slash/priority',
      'PATCH:/api/todo/id%2Fco-slash/deadline',
      'PATCH:/api/todo/id%2Fco-slash/progress',
      'GET:/api/todo/overdue',
      'GET:/api/todo/upcoming-deadline',
    ],
  );
});

test('DTO Todo nhận urgent và chặn tiến độ, hạn chót, số ngày không hợp lệ', async () => {
  assert.deepEqual(
    await validate(
      plainToInstance(UpdateTaskPriorityDto, { priority: 'urgent' }),
    ),
    [],
  );
  assert.deepEqual(
    await validate(plainToInstance(UpdateTaskProgressDto, { progress: 75 })),
    [],
  );
  assert.deepEqual(
    await validate(plainToInstance(UpcomingDeadlineQueryDto, { days: '7' })),
    [],
  );
  for (const progress of [-1, 101, 50.5, 'abc', null]) {
    assert(
      (await validate(plainToInstance(UpdateTaskProgressDto, { progress })))
        .length > 0,
    );
  }
  for (const days of [0, 31, 1.5, 'abc']) {
    assert(
      (await validate(plainToInstance(UpcomingDeadlineQueryDto, { days })))
        .length > 0,
    );
  }
  assert(
    (
      await validate(
        plainToInstance(UpdateTaskDeadlineDto, { deadline: 'invalid-date' }),
      )
    ).length > 0,
  );
  assert(
    (
      await validate(
        plainToInstance(UpdateTaskPriorityDto, {
          priority: 'invalid-priority',
        }),
      )
    ).length > 0,
  );
});
