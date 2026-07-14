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
exports.WorkscheduleService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let WorkscheduleService = class WorkscheduleService {
    httpService;
    configService;
    baseUrl;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.baseUrl = this.configService.get('WORKSCHEDULE_SERVICE_URL', 'http://localhost:5004');
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
    async getPendingRequests(user) {
        return this.forward('GET', '/api/workschedule/schedule/pending', null, null, user);
    }
    async getAllRequests(user) {
        return this.forward('GET', '/api/workschedule/schedule/all', null, null, user);
    }
    async approveRequest(id, user) {
        return this.forward('POST', `/api/workschedule/schedule/requests/${id}/approve`, null, null, user);
    }
    async rejectRequest(id, user) {
        return this.forward('POST', `/api/workschedule/schedule/requests/${id}/reject`, null, null, user);
    }
    async bulkApprove(dto, user) {
        return this.forward('POST', '/api/workschedule/schedule/requests/bulk-approve', dto, null, user);
    }
    async getHeatmap(user) {
        return this.forward('GET', '/api/workschedule/schedule/heatmap', null, null, user);
    }
    async scanAttendance(dto, user) {
        return this.forward('POST', '/api/workschedule/attendance/scan', dto, null, user);
    }
    async getMyAttendance(user) {
        return this.forward('GET', '/api/workschedule/attendance/my', null, null, user);
    }
    async generateQrToken(user) {
        return this.forward('POST', '/api/workschedule/attendance/qr/generate', null, null, user);
    }
    async getTodayAttendance(user) {
        return this.forward('GET', '/api/workschedule/attendance/today', null, null, user);
    }
    async getReport(user) {
        return this.forward('GET', '/api/workschedule/attendance/report', null, null, user);
    }
    async getPolicy() {
        return this.forward('GET', '/api/workschedule/policy');
    }
    async updatePolicy(dto, user) {
        return this.forward('PATCH', '/api/workschedule/policy', dto, null, user);
    }
    async getMySchedules(user) {
        return this.forward('GET', '/api/workschedule/schedule/my', null, null, user);
    }
    async createRequest(dto, user) {
        return this.forward('POST', '/api/workschedule/schedule/requests', dto, null, user);
    }
    async getRequestInfo(id, user) {
        return this.forward('GET', `/api/workschedule/schedule/requests/${id}`, null, null, user);
    }
    async updateEntries(id, dto, user) {
        return this.forward('PATCH', `/api/workschedule/schedule/requests/${id}`, dto, null, user);
    }
    async submitRequest(id, user) {
        return this.forward('POST', `/api/workschedule/schedule/requests/${id}/submit`, null, null, user);
    }
    async deleteRequest(id, user) {
        return this.forward('DELETE', `/api/workschedule/schedule/requests/${id}`, null, null, user);
    }
};
exports.WorkscheduleService = WorkscheduleService;
exports.WorkscheduleService = WorkscheduleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], WorkscheduleService);
//# sourceMappingURL=workschedule.service.js.map