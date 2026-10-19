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
  outcome?: GatewayRequestOutcome;
  perf?: {
    authMs?: number;
    upstreamMs?: number;
  };
}

export interface RequestWithContext extends Request {
  requestContext?: GatewayRequestContext;
}

/** Danh tính Auth trả về khi introspect; được ký rồi chuyển tiếp cho các service. */
export interface GatewayUser {
  _id: string;
  email?: string;
  username?: string;
  role?: string;
}

/** Request đã qua `JwtAuthGuard` nên chắc chắn có `user`. */
export interface AuthenticatedRequest extends RequestWithContext {
  user: GatewayUser;
}
