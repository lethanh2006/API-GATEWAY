import { Injectable, NestMiddleware } from '@nestjs/common';
import { runWithLogContext } from '@nrapp/observability';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Response } from 'express';
import type { RequestWithContext } from '../interfaces/request-context.interface';

export const REQUEST_ID_HEADER = 'x-request-id';
export const CLIENT_REQUEST_ID_HEADER = 'x-client-request-id';
export const SAFE_REQUEST_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(
    request: RequestWithContext,
    response: Response,
    next: NextFunction,
  ): void {
    const incomingRequestId = request.headers[REQUEST_ID_HEADER];
    const clientRequestId =
      typeof incomingRequestId === 'string' &&
      SAFE_REQUEST_ID.test(incomingRequestId)
        ? incomingRequestId
        : undefined;
    const requestId = randomUUID();

    request.requestContext = {
      requestId,
      ...(clientRequestId ? { clientRequestId } : {}),
      startedAt: process.hrtime.bigint(),
    };
    request.headers[REQUEST_ID_HEADER] = requestId;
    if (clientRequestId) {
      request.headers[CLIENT_REQUEST_ID_HEADER] = clientRequestId;
    } else {
      delete request.headers[CLIENT_REQUEST_ID_HEADER];
    }
    response.setHeader(REQUEST_ID_HEADER, requestId);
    runWithLogContext(
      {
        request_id: requestId,
        ...(clientRequestId ? { client_request_id: clientRequestId } : {}),
      },
      () => next(),
    );
  }
}
