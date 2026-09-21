import { Injectable, type OnApplicationShutdown } from '@nestjs/common';
import {
  createAppLogger,
  flushLoggerAndShutdownTelemetry,
  logAndRecordException,
  type ClassificationOverrides,
  PinoNestLogger,
} from '@nrapp/observability';

export const appLogger: ReturnType<typeof createAppLogger> = createAppLogger({
  serviceName: 'gateway',
});

export const nestLogger = new PinoNestLogger(appLogger, 'Gateway');

export type LogDetails = Record<string, unknown>;

/** Adapter log dùng chung cho Gateway; Pino tự gắn trace/request context. */
@Injectable()
export class StructuredLoggerService {
  readonly raw: ReturnType<typeof createAppLogger> = appLogger;

  info(eventName: string, details: LogDetails = {}, message?: string): void {
    this.raw.info(
      { ...details, 'event.name': eventName },
      message ?? eventName,
    );
  }

  warn(eventName: string, details: LogDetails = {}, message?: string): void {
    this.raw.warn(
      { ...details, 'event.name': eventName },
      message ?? eventName,
    );
  }

  error(eventName: string, details: LogDetails = {}, message?: string): void {
    this.raw.error(
      { ...details, 'event.name': eventName },
      message ?? eventName,
    );
  }

  unexpected(
    eventName: string,
    error: unknown,
    details: LogDetails = {},
    classification?: ClassificationOverrides,
  ): { errorId: string; recordedOnSpan: boolean } {
    const result = logAndRecordException(
      this.raw,
      eventName,
      error,
      details,
      classification ? { classification } : undefined,
    );

    return {
      errorId: result.errorId,
      recordedOnSpan: result.recordedOnSpan,
    };
  }
}

@Injectable()
export class TelemetryLifecycleService implements OnApplicationShutdown {
  async onApplicationShutdown(): Promise<void> {
    await flushLoggerAndShutdownTelemetry(appLogger, 3_000);
  }
}
