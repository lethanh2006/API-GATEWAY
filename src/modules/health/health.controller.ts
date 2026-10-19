import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { type GatewayHealth, HealthService } from './health.service';

/** Healthcheck cho Compose: `/health` và `/health/live` báo process còn sống. */
@ApiExcludeController()
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get(['', 'live'])
  getLiveness(): GatewayHealth {
    return this.healthService.getLiveness();
  }
}
