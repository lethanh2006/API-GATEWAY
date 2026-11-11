import { randomUUID } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import type { HttpService } from '@nestjs/axios';
import type { AxiosResponse } from 'axios';

import type {
  GatewayUser,
  RequestWithContext,
} from '../interfaces/request-context.interface';
import type {
  InternalRequestSignatureService,
  InternalService,
} from '../security/internal-request-signature.service';
import { throwUpstreamError } from './upstream-error';

interface UpstreamClientOptions {
  httpService: HttpService;
  signatureService: InternalRequestSignatureService;
  request: RequestWithContext;
  service: InternalService;
  baseUrl: string;
  /** Tên dịch vụ dùng trong thông báo lỗi, ví dụ "Dịch vụ căn tin". */
  label: string;
  /** Gắn chữ ký danh tính với `METHOD:path`. Canteen chỉ ký danh tính, không ký route. */
  signRoute?: boolean;
}

interface UpstreamCall {
  data?: unknown;
  params?: unknown;
  /** Người gọi đã xác thực; bỏ trống với route công khai. */
  user?: GatewayUser;
  /** Ngữ cảnh ký thay cho `METHOD:path`, khi upstream gắn chữ ký với nội dung body. */
  signatureContext?: string;
}

type BodylessCall = Omit<UpstreamCall, 'data'>;

/**
 * Gửi request tới một service upstream thay cho request hiện tại của Gateway: gắn
 * `x-request-id`, ký danh tính người gọi, ghi thời gian upstream và đổi lỗi upstream
 * sang định dạng lỗi của Gateway.
 */
export class UpstreamClient {
  constructor(private readonly options: UpstreamClientOptions) {}

  get(path: string, call: BodylessCall = {}) {
    return this.forward('GET', path, call);
  }

  delete(path: string, call: BodylessCall = {}) {
    return this.forward('DELETE', path, call);
  }

  post(path: string, data?: unknown, call: BodylessCall = {}) {
    return this.forward('POST', path, { ...call, data });
  }

  put(path: string, data?: unknown, call: BodylessCall = {}) {
    return this.forward('PUT', path, { ...call, data });
  }

  patch(path: string, data?: unknown, call: BodylessCall = {}) {
    return this.forward('PATCH', path, { ...call, data });
  }

  async forward(
    method: string,
    path: string,
    call: UpstreamCall = {},
  ): Promise<unknown> {
    return (await this.send(method, path, call)).data;
  }

  /** Trả nguyên response, gồm cả status code (`forward` chỉ trả body). */
  async send(
    method: string,
    path: string,
    { data, params, user, signatureContext }: UpstreamCall = {},
  ): Promise<AxiosResponse> {
    const { httpService, request, baseUrl, label } = this.options;
    const headers = this.headers(method, path, user, signatureContext);

    const started = performance.now();
    try {
      return await httpService.axiosRef.request({
        method,
        url: `${baseUrl}${path}`,
        data: data ?? null,
        params: params ?? null,
        headers,
      });
    } catch (error: unknown) {
      throwUpstreamError(error, label);
    } finally {
      if (request.requestContext) {
        (request.requestContext.perf ??= {}).upstreamMs =
          performance.now() - started;
      }
    }
  }

  headers(
    method: string,
    path: string,
    user?: GatewayUser,
    signatureContext?: string,
  ): Record<string, string> {
    const {
      request,
      signatureService,
      service,
      signRoute = true,
    } = this.options;
    const requestId = request.requestContext?.requestId ?? randomUUID();
    const headers: Record<string, string> = { 'x-request-id': requestId };
    if (!user) return headers;

    const payload = Buffer.from(JSON.stringify(user)).toString('base64');
    const context =
      signatureContext ??
      (signRoute ? `${method.toUpperCase()}:${path}` : undefined);
    return {
      ...headers,
      ...signatureService.signUserPayload(payload, requestId, service, context),
    };
  }
}
