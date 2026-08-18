"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitMiddleware = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let RateLimitMiddleware = class RateLimitMiddleware {
    buckets = new Map();
    windowMs;
    maxRequests;
    constructor(configService) {
        const configuredWindowMs = Number(configService.get("RATE_LIMIT_WINDOW_MS") ?? 60_000);
        const configuredMaxRequests = Number(configService.get("RATE_LIMIT_MAX_REQUESTS") ?? 120);
        this.windowMs =
            Number.isFinite(configuredWindowMs) && configuredWindowMs > 0
                ? configuredWindowMs
                : 60_000;
        this.maxRequests =
            Number.isInteger(configuredMaxRequests) && configuredMaxRequests > 0
                ? configuredMaxRequests
                : 120;
    }
    use(request, response, next) {
        const now = Date.now();
        const key = request.ip || request.socket.remoteAddress || "unknown";
        let bucket = this.buckets.get(key);
        if (!bucket || bucket.resetAt <= now) {
            bucket = { count: 0, resetAt: now + this.windowMs };
            this.buckets.set(key, bucket);
        }
        bucket.count += 1;
        const remaining = Math.max(0, this.maxRequests - bucket.count);
        response.setHeader("x-ratelimit-limit", this.maxRequests);
        response.setHeader("x-ratelimit-remaining", remaining);
        response.setHeader("x-ratelimit-reset", Math.ceil(bucket.resetAt / 1000));
        if (bucket.count > this.maxRequests) {
            response.setHeader("retry-after", Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)));
            response.status(429).json({
                statusCode: 429,
                message: "Quá nhiều request, vui lòng thử lại sau",
                requestId: request.requestContext?.requestId,
            });
            return;
        }
        if (this.buckets.size > 10_000) {
            this.removeExpiredBuckets(now);
        }
        next();
    }
    removeExpiredBuckets(now) {
        for (const [key, bucket] of this.buckets) {
            if (bucket.resetAt <= now) {
                this.buckets.delete(key);
            }
        }
    }
};
exports.RateLimitMiddleware = RateLimitMiddleware;
exports.RateLimitMiddleware = RateLimitMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RateLimitMiddleware);
//# sourceMappingURL=rate-limit.middleware.js.map