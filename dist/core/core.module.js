"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rate_limit_middleware_1 = require("../common/middleware/rate-limit.middleware");
const request_id_middleware_1 = require("../common/middleware/request-id.middleware");
let CoreModule = class CoreModule {
    configure(consumer) {
        consumer.apply(request_id_middleware_1.RequestIdMiddleware, rate_limit_middleware_1.RateLimitMiddleware).forRoutes("*");
    }
};
exports.CoreModule = CoreModule;
exports.CoreModule = CoreModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({ imports: [config_1.ConfigModule] })
], CoreModule);
//# sourceMappingURL=core.module.js.map