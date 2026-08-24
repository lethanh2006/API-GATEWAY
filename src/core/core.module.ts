import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from '../common/filters/global-exception.filter';
import { RateLimitMiddleware } from '../common/middleware/rate-limit.middleware';
import { RequestIdMiddleware } from '../common/middleware/request-id.middleware';
import { RequestOutcomeMiddleware } from '../common/middleware/request-outcome.middleware';
import { StructuredLoggerService } from '../common/observability/structured-logger.service';
import { TelemetryLifecycleService } from '../common/observability/telemetry-lifecycle.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    StructuredLoggerService,
    TelemetryLifecycleService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [StructuredLoggerService],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestIdMiddleware, RequestOutcomeMiddleware, RateLimitMiddleware)
      .forRoutes('*');
  }
}
