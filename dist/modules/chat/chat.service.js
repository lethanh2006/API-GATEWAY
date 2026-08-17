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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const form_data_1 = __importDefault(require("form-data"));
const upstream_error_1 = require("../../common/http/upstream-error");
let ChatService = ChatService_1 = class ChatService {
    httpService;
    configService;
    logger = new common_1.Logger(ChatService_1.name);
    baseUrl;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.baseUrl = this.configService.get('CHAT_SERVICE_URL', 'http://localhost:5002');
    }
    createUserHeaders(user) {
        const headers = {};
        if (user) {
            const userPayloadStr = JSON.stringify(user);
            const base64User = Buffer.from(userPayloadStr).toString('base64');
            headers['x-user-payload'] = base64User;
        }
        return headers;
    }
    async forward(method, path, data, params, user) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.request({
                method,
                url: `${this.baseUrl}${path}`,
                data,
                params,
                headers: this.createUserHeaders(user),
            }));
            return response.data;
        }
        catch (error) {
            (0, upstream_error_1.throwUpstreamError)(error, 'Dịch vụ trò chuyện', this.logger);
        }
    }
    async createChat(dto, user) {
        return this.forward('POST', '/api/chat/chat/new', dto, null, user);
    }
    async getAllChats(user) {
        return this.forward('GET', '/api/chat/chat/all', null, null, user);
    }
    async sendMessage(dto, image, user) {
        if (!image) {
            return this.forward('POST', '/api/chat/message', dto, null, user);
        }
        const form = new form_data_1.default();
        form.append('chatId', dto.chatId);
        if (dto.text)
            form.append('text', dto.text);
        form.append('image', image.buffer, {
            filename: image.originalname || 'chat-image.jpg',
            contentType: image.mimetype || 'image/jpeg',
            knownLength: image.buffer.length,
        });
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}/api/chat/message`, form, {
                headers: {
                    ...form.getHeaders(),
                    ...this.createUserHeaders(user),
                },
                maxBodyLength: 6 * 1024 * 1024,
                maxContentLength: 6 * 1024 * 1024,
                timeout: 55_000,
            }));
            return response.data;
        }
        catch (error) {
            (0, upstream_error_1.throwUpstreamError)(error, 'Dịch vụ trò chuyện', this.logger);
        }
    }
    async getMessages(chatId, user) {
        return this.forward('GET', `/api/chat/message/${encodeURIComponent(chatId)}`, null, null, user);
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], ChatService);
//# sourceMappingURL=chat.service.js.map