"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestIdMiddleware = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const SAFE_REQUEST_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
let RequestIdMiddleware = class RequestIdMiddleware {
    use(request, response, next) {
        const incomingRequestId = request.headers["x-request-id"];
        const requestId = typeof incomingRequestId === "string" &&
            SAFE_REQUEST_ID.test(incomingRequestId)
            ? incomingRequestId
            : (0, crypto_1.randomUUID)();
        request.requestContext = {
            requestId,
            startedAt: process.hrtime.bigint(),
        };
        request.headers["x-request-id"] = requestId;
        response.setHeader("x-request-id", requestId);
        next();
    }
};
exports.RequestIdMiddleware = RequestIdMiddleware;
exports.RequestIdMiddleware = RequestIdMiddleware = __decorate([
    (0, common_1.Injectable)()
], RequestIdMiddleware);
//# sourceMappingURL=request-id.middleware.js.map