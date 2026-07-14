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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkscheduleController = void 0;
const common_1 = require("@nestjs/common");
const workschedule_service_1 = require("./workschedule.service");
const jwt_guard_1 = require("../auth/common/guard/jwt/jwt.guard");
const role_guard_1 = require("../auth/common/guard/role/role.guard");
const role_decorator_1 = require("../../common/decorators/role.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
const swagger_1 = require("@nestjs/swagger");
let WorkscheduleController = class WorkscheduleController {
    workscheduleService;
    constructor(workscheduleService) {
        this.workscheduleService = workscheduleService;
    }
    async getPendingRequests(req) {
        return this.workscheduleService.getPendingRequests(req.user);
    }
    async getAllRequests(req) {
        return this.workscheduleService.getAllRequests(req.user);
    }
    async approveRequest(id, req) {
        return this.workscheduleService.approveRequest(id, req.user);
    }
    async rejectRequest(id, req) {
        return this.workscheduleService.rejectRequest(id, req.user);
    }
    async bulkApprove(body, req) {
        return this.workscheduleService.bulkApprove(body, req.user);
    }
    async getHeatmap(req) {
        return this.workscheduleService.getHeatmap(req.user);
    }
    async scanAttendance(body, req) {
        return this.workscheduleService.scanAttendance(body, req.user);
    }
    async getMyAttendance(req) {
        return this.workscheduleService.getMyAttendance(req.user);
    }
    async generateQrToken(req) {
        return this.workscheduleService.generateQrToken(req.user);
    }
    async getTodayAttendance(req) {
        return this.workscheduleService.getTodayAttendance(req.user);
    }
    async getReport(req) {
        return this.workscheduleService.getReport(req.user);
    }
    async getPolicy() {
        return this.workscheduleService.getPolicy();
    }
    async updatePolicy(body, req) {
        return this.workscheduleService.updatePolicy(body, req.user);
    }
    async getMySchedules(req) {
        return this.workscheduleService.getMySchedules(req.user);
    }
    async createRequest(body, req) {
        return this.workscheduleService.createRequest(body, req.user);
    }
    async getRequestInfo(id, req) {
        return this.workscheduleService.getRequestInfo(id, req.user);
    }
    async updateEntries(id, body, req) {
        return this.workscheduleService.updateEntries(id, body, req.user);
    }
    async submitRequest(id, req) {
        return this.workscheduleService.submitRequest(id, req.user);
    }
    async deleteRequest(id, req) {
        return this.workscheduleService.deleteRequest(id, req.user);
    }
};
exports.WorkscheduleController = WorkscheduleController;
__decorate([
    (0, common_1.Get)('schedule/pending'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách yêu cầu lịch làm việc chờ phê duyệt (Admin)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "getPendingRequests", null);
__decorate([
    (0, common_1.Get)('schedule/all'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy tất cả danh sách yêu cầu lịch làm việc (Admin)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "getAllRequests", null);
__decorate([
    (0, common_1.Post)('schedule/requests/:id/approve'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Duyệt yêu cầu lịch làm việc (Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 'req123' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "approveRequest", null);
__decorate([
    (0, common_1.Post)('schedule/requests/:id/reject'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Từ chối yêu cầu lịch làm việc (Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 'req123' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "rejectRequest", null);
__decorate([
    (0, common_1.Post)('schedule/requests/bulk-approve'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Phê duyệt hàng loạt yêu cầu lịch làm việc (Admin)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "bulkApprove", null);
__decorate([
    (0, common_1.Get)('schedule/heatmap'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy dữ liệu heatmap lịch làm việc (Admin)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "getHeatmap", null);
__decorate([
    (0, common_1.Post)('attendance/scan'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Điểm danh bằng quét QR Code' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "scanAttendance", null);
__decorate([
    (0, common_1.Get)('attendance/my'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách điểm danh cá nhân' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "getMyAttendance", null);
__decorate([
    (0, common_1.Post)('attendance/qr/generate'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo mã QR Code điểm danh (Admin)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "generateQrToken", null);
__decorate([
    (0, common_1.Get)('attendance/today'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách điểm danh hôm nay (Admin)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "getTodayAttendance", null);
__decorate([
    (0, common_1.Get)('attendance/report'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy báo cáo điểm danh (Admin)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "getReport", null);
__decorate([
    (0, common_1.Get)('policy'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy chính sách chấm công (PUBLIC)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "getPolicy", null);
__decorate([
    (0, common_1.Patch)('policy'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật chính sách chấm công (Admin)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "updatePolicy", null);
__decorate([
    (0, common_1.Get)('schedule/my'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách lịch làm việc của bản thân' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "getMySchedules", null);
__decorate([
    (0, common_1.Post)('schedule/requests'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo yêu cầu đăng ký lịch làm việc mới' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "createRequest", null);
__decorate([
    (0, common_1.Get)('schedule/requests/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Xem chi tiết một yêu cầu lịch làm việc' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 'req123' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "getRequestInfo", null);
__decorate([
    (0, common_1.Patch)('schedule/requests/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật nội dung một yêu cầu lịch làm việc' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 'req123' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "updateEntries", null);
__decorate([
    (0, common_1.Post)('schedule/requests/:id/submit'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Nộp yêu cầu đăng ký lịch làm việc lên cấp trên' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 'req123' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "submitRequest", null);
__decorate([
    (0, common_1.Delete)('schedule/requests/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa yêu cầu đăng ký lịch làm việc' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 'req123' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorkscheduleController.prototype, "deleteRequest", null);
exports.WorkscheduleController = WorkscheduleController = __decorate([
    (0, swagger_1.ApiTags)('Api Workschedule'),
    (0, common_1.Controller)('api/workschedule'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    __metadata("design:paramtypes", [workschedule_service_1.WorkscheduleService])
], WorkscheduleController);
//# sourceMappingURL=workschedule.controller.js.map