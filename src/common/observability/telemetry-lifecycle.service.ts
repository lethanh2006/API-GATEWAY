import { Injectable, type OnApplicationShutdown } from '@nestjs/common';
import { shutdownTelemetry } from '@nrapp/observability';

@Injectable()
export class TelemetryLifecycleService implements OnApplicationShutdown {
  async onApplicationShutdown(): Promise<void> {
    await shutdownTelemetry(5_000);
  }
}
