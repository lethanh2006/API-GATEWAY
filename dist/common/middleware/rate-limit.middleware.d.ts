import { NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { NextFunction, Response } from "express";
import type { RequestWithContext } from "../interfaces/request-context.interface";
export declare class RateLimitMiddleware implements NestMiddleware {
    private readonly buckets;
    private readonly windowMs;
    private readonly maxRequests;
    constructor(configService: ConfigService);
    use(request: RequestWithContext, response: Response, next: NextFunction): void;
    private removeExpiredBuckets;
}
