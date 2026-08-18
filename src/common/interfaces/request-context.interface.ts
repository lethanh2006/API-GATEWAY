import type { Request } from "express";

export interface GatewayRequestContext {
  requestId: string;
  startedAt: bigint;
}

export interface RequestWithContext extends Request {
  requestContext?: GatewayRequestContext;
}
