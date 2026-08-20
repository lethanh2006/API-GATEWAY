import assert from "node:assert/strict";
import test from "node:test";
import type { CallHandler, ExecutionContext } from "@nestjs/common";
import type { Response } from "express";
import { lastValueFrom, of } from "rxjs";
import type { RequestWithContext } from "../interfaces/request-context.interface";
import type {
  LogDetails,
  StructuredLoggerService,
} from "../observability/structured-logger.service";
import { HttpLoggingInterceptor } from "./http-logging.interceptor";

test("ghi log completed với các field HTTP bắt buộc", async () => {
  const captured: Array<{ event: string; details: LogDetails }> = [];
  const logger = {
    info: (event: string, details: LogDetails) => captured.push({ event, details }),
  } as unknown as StructuredLoggerService;
  const request = {
    method: "GET",
    originalUrl: "/api/user/me",
    requestContext: {
      requestId: "request-123",
      startedAt: process.hrtime.bigint(),
    },
    user: { _id: "user-123" },
  } as unknown as RequestWithContext;
  const response = { statusCode: 200 } as Response;
  const context = {
    getType: () => "http",
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
    }),
  } as unknown as ExecutionContext;
  const next = { handle: () => of({ ok: true }) } as CallHandler;

  await lastValueFrom(new HttpLoggingInterceptor(logger).intercept(context, next));

  assert.equal(captured.length, 1);
  assert.equal(captured[0]?.event, "http_request_completed");
  assert.deepEqual(
    {
      ...captured[0]?.details,
      durationMs: typeof captured[0]?.details.durationMs,
    },
    {
      requestId: "request-123",
      userId: "user-123",
      method: "GET",
      path: "/api/user/me",
      statusCode: 200,
      durationMs: "number",
    },
  );
});
