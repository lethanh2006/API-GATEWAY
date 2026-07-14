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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let ChatService = class ChatService {
    httpService;
    configService;
    baseUrl;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.baseUrl = this.configService.get('CHAT_SERVICE_URL', 'http://localhost:5002');
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
    async createChat(dto, user) {
        return this.forward('POST', '/api/chat/chat/new', dto, null, user);
    }
    async getAllChats(user) {
        return this.forward('GET', '/api/chat/chat/all', null, null, user);
    }
    async sendMessage(dto, user) {
        return this.forward('POST', '/api/chat/message', dto, null, user);
    }
    async getMessages(chatId, user) {
        return this.forward('GET', `/api/chat/message/${chatId}`, null, null, user);
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], ChatService);
//# sourceMappingURL=chat.service.js.map