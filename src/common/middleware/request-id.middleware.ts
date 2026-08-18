import { Injectable, NestMiddleware } from "@nestjs/common";
import { randomUUID } from "crypto";
import type { NextFunction, Response } from "express";
import type { RequestWithContext } from "../interfaces/request-context.interface";

const SAFE_REQUEST_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(
    request: RequestWithContext,
    response: Response,
    next: NextFunction,
  ): void {
    const incomingRequestId = request.headers["x-request-id"];
    const requestId =
      typeof incomingRequestId === "string" &&
      SAFE_REQUEST_ID.test(incomingRequestId)
        ? incomingRequestId
        : randomUUID();

    request.requestContext = {
      requestId,
      startedAt: process.hrtime.bigint(),
    };
    request.headers["x-request-id"] = requestId;
    response.setHeader("x-request-id", requestId);
    next();
  }
}
