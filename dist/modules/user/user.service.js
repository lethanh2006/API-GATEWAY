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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const upstream_error_1 = require("../../common/http/upstream-error");
let UserService = UserService_1 = class UserService {
    httpService;
    configService;
    logger = new common_1.Logger(UserService_1.name);
    baseUrl;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.baseUrl = this.configService.get('USER_SERVICE_URL', 'http://localhost:5000');
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
            (0, upstream_error_1.throwUpstreamError)(error, 'Dịch vụ người dùng', this.logger);
        }
    }
    async getMyProfile(user) {
        return this.forward('GET', '/api/user/me', null, null, user);
    }
    async getPublicProfile(userId, user) {
        return this.forward('GET', `/api/user/user/${userId}`, null, null, user);
    }
    async getFullProfileByAdmin(userId, user) {
        return this.forward('GET', `/api/user/user/${userId}`, null, null, user);
    }
    async getAllUsers(user) {
        return this.forward('GET', '/api/user/user/all', null, null, user);
    }
    async updateUser(dto, user) {
        return this.forward('POST', '/api/user/update/user', dto, null, user);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map