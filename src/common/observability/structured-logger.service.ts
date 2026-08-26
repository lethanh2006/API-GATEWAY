import { Injectable } from '@nestjs/common';
import {
  createAppLogger,
  logAndRecordException,
  type ClassificationOverrides,
} from '@nrapp/observability';
import { appLogger } from './app-logger';

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
