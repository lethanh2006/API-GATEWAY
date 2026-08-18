import { Global, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RateLimitMiddleware } from "../common/middleware/rate-limit.middleware";
import { RequestIdMiddleware } from "../common/middleware/request-id.middleware";

@Global()
@Module({ imports: [ConfigModule] })
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware, RateLimitMiddleware).forRoutes("*");
  }
}
