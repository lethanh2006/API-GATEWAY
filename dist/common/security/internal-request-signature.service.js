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
exports.InternalRequestSignatureService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
let InternalRequestSignatureService = class InternalRequestSignatureService {
    secret;
    production;
    constructor(configService) {
        this.secret = configService.get("CANTEEN_INTERNAL_SECRET");
        this.production = configService.get("NODE_ENV") === "production";
    }
    signUserPayload(payload, requestId) {
        if (!this.secret || (this.production && this.secret.length < 32)) {
            if (this.production) {
                throw new common_1.ServiceUnavailableException("Gateway chưa được cấu hình để gọi dịch vụ căn tin");
            }
            return { "x-user-payload": payload };
        }
        const timestamp = Date.now().toString();
        const signature = (0, crypto_1.createHmac)("sha256", this.secret)
            .update(`${timestamp}.${requestId}.${payload}`)
            .digest("hex");
        return {
            "x-user-payload": payload,
            "x-user-timestamp": timestamp,
            "x-user-signature": signature,
        };
    }
};
exports.InternalRequestSignatureService = InternalRequestSignatureService;
exports.InternalRequestSignatureService = InternalRequestSignatureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], InternalRequestSignatureService);
//# sourceMappingURL=internal-request-signature.service.js.map