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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let AuthService = class AuthService {
    httpService;
    configService;
    baseUrl;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.baseUrl = this.configService.get('AUTH_SERVICE_URL', 'http://localhost:4000');
    }
    async forward(method, path, data, params, user) {
        const headers = {};
        if (user) {
            const userPayloadStr = JSON.stringify(user);
            const base64User = Buffer.from(userPayloadStr).toString('base64');
            headers['x-user-payload'] = base64User;
        }
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.request({
                method,
                url: `${this.baseUrl}${path}`,
                data,
                params,
                headers,
            }));
            return response.data;
        }
        catch (error) {
            if (error.response) {
                return error.response.data;
            }
            throw error;
        }
    }
    async register(dto) {
        return this.forward('POST', '/api/auth/register', dto);
    }
    async login(dto) {
        return this.forward('POST', '/api/auth/login', dto);
    }
    async verifyOtp(dto) {
        return this.forward('POST', '/api/auth/verify', dto);
    }
    async refresh(dto) {
        return this.forward('POST', '/api/auth/refresh', dto);
    }
    async loginWithGoogle(dto) {
        return this.forward('POST', '/api/auth/login-google', dto);
    }
    async getMyProfile(user) {
        return this.forward('GET', '/api/auth/me', null, null, user);
    }
    async updateMyEmail(dto, user) {
        return this.forward('PATCH', '/api/auth/me/email', dto, null, user);
    }
    async deleteMyAccount(user) {
        return this.forward('DELETE', '/api/auth/me', null, null, user);
    }
    async getUserProfileByAdmin(userId, user) {
        return this.forward('GET', `/api/auth/users/${userId}`, null, null, user);
    }
    async deleteUserByAdmin(userId, user) {
        return this.forward('DELETE', `/api/auth/users/${userId}`, null, null, user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map