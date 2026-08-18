import { NestMiddleware } from "@nestjs/common";
import type { NextFunction, Response } from "express";
import type { RequestWithContext } from "../interfaces/request-context.interface";
export declare class RequestIdMiddleware implements NestMiddleware {
    use(request: RequestWithContext, response: Response, next: NextFunction): void;
}
