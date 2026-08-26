import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from '../common/filters/global-exception.filter';
import { RateLimitMiddleware } from '../common/middleware/rate-limit.middleware';
import { RequestIdMiddleware } from '../common/middleware/request-id.middleware';
import { RequestOutcomeMiddleware } from '../common/middleware/request-outcome.middleware';
import { StructuredLoggerService } from '../common/observability/structured-logger.service';
import { TelemetryLifecycleService } from '../common/observability/telemetry-lifecycle.service';
import { InternalRequestSignatureService } from '../common/security/internal-request-signature.service';

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
