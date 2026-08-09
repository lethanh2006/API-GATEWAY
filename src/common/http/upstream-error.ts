import { BadGatewayException, HttpException, Logger } from '@nestjs/common';
import { isAxiosError } from 'axios';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function createErrorPayload(
  data: unknown,
  status: number,
  serviceName: string,
) {
  if (isRecord(data)) {
    return {
      ...data,
      statusCode: typeof data.statusCode === 'number' ? data.statusCode : status,
      message: data.message ?? `${serviceName} không thể xử lý yêu cầu`,
    };
  }

  if (typeof data === 'string' && data.trim()) {
    return {
      statusCode: status,
      message: data,
    };
  }

  return {
    statusCode: status,
    message: `${serviceName} không thể xử lý yêu cầu`,
  };
}

export function throwUpstreamError(
  error: unknown,
  serviceName: string,
  logger: Logger,
): never {
  if (isAxiosError(error) && error.response) {
    const { data, status } = error.response;
    throw new HttpException(
      createErrorPayload(data, status, serviceName),
      status,
    );
  }

  const detail = error instanceof Error ? error.message : String(error);
  logger.warn(`Không kết nối được ${serviceName}: ${detail}`);
  throw new BadGatewayException(`${serviceName} hiện không khả dụng`);
}
