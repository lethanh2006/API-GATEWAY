import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from '../common/global-exception.filter';
import { InternalRequestSignatureService } from '../common/internal-request-signature.service';
import {
  StructuredLoggerService,
  TelemetryLifecycleService,
} from '../common/observability';
import { RateLimitMiddleware } from '../common/rate-limit.middleware';
import { RequestIdMiddleware } from '../common/request-id.middleware';
import { RequestOutcomeMiddleware } from '../common/request-outcome.middleware';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    StructuredLoggerService,
    InternalRequestSignatureService,
    TelemetryLifecycleService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [StructuredLoggerService, InternalRequestSignatureService],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestIdMiddleware, RequestOutcomeMiddleware, RateLimitMiddleware)
      .forRoutes('*');
  }
}
