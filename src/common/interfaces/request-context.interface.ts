import type { Request } from 'express';

export interface GatewayRequestOutcome {
  code: string;
  validationFields?: string[];
  errorId?: string;
  originService?: string;
}

export interface GatewayRequestContext {
  requestId: string;
  clientRequestId?: string;
  startedAt: bigint;
  outcome?: GatewayRequestOutcome;
}

export interface RequestWithContext extends Request {
  requestContext?: GatewayRequestContext;
}
