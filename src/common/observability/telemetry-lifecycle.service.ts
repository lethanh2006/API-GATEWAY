import { Injectable, type OnApplicationShutdown } from '@nestjs/common';
import { flushLoggerAndShutdownTelemetry } from '@nrapp/observability';
import { gatewayAppLogger } from './structured-logger.service';

@Injectable()
export class TelemetryLifecycleService implements OnApplicationShutdown {
  async onApplicationShutdown(): Promise<void> {
    await flushLoggerAndShutdownTelemetry(gatewayAppLogger, 3_000);
  }
}
