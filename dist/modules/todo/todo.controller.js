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
exports.TodoController = void 0;
const common_1 = require("@nestjs/common");
const todo_service_1 = require("./todo.service");
const jwt_guard_1 = require("../auth/common/guard/jwt/jwt.guard");
const role_guard_1 = require("../auth/common/guard/role/role.guard");
const role_decorator_1 = require("../../common/decorators/role.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
const swagger_1 = require("@nestjs/swagger");
let TodoController = class TodoController {
    todoService;
    constructor(todoService) {
        this.todoService = todoService;
    }
    async getMyTasks(req) {
        return this.todoService.getMyTasks(req.user);
    }
    async updateTaskStatus(id, status, req) {
        return this.todoService.updateTaskStatus(id, status, req.user);
    }
    async createTask(body, req) {
        return this.todoService.createTask(body, req.user);
    }
    async assignTask(id, assignedTo, req) {
        return this.todoService.assignTask(id, assignedTo, req.user);
    }
    async getAllTasks(req) {
        return this.todoService.getAllTasks(req.user);
    }
    async deleteTask(id, req) {
        return this.todoService.deleteTask(id, req.user);
    }
};
exports.TodoController = TodoController;
__decorate([
    (0, common_1.Get)('my-tasks'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách công việc của người dùng hiện tại' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "getMyTasks", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật trạng thái của một công việc' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 'taskId123' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "updateTaskStatus", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo công việc mới (chỉ Admin)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "createTask", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Giao lại công việc cho người dùng (chỉ Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 'taskId123' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('assignedTo')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "assignTask", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy tất cả công việc (chỉ Admin)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "getAllTasks", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa công việc (chỉ Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 'taskId123' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "deleteTask", null);
exports.TodoController = TodoController = __decorate([
    (0, swagger_1.ApiTags)('Api Todo'),
    (0, common_1.Controller)('api/todo'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    __metadata("design:paramtypes", [todo_service_1.TodoService])
], TodoController);
//# sourceMappingURL=todo.controller.js.map