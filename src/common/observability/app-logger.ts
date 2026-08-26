import { createAppLogger, PinoNestLogger } from '@nrapp/observability';

export const appLogger: ReturnType<typeof createAppLogger> = createAppLogger({
  serviceName: 'gateway',
});

export const nestLogger = new PinoNestLogger(appLogger, 'Gateway');
