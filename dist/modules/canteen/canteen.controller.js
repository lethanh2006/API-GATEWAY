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
exports.CanteenController = void 0;
const common_1 = require("@nestjs/common");
const canteen_service_1 = require("./canteen.service");
const jwt_guard_1 = require("../auth/common/guard/jwt/jwt.guard");
const role_guard_1 = require("../auth/common/guard/role/role.guard");
const role_decorator_1 = require("../../common/decorators/role.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
const swagger_1 = require("@nestjs/swagger");
const create_menu_item_dto_1 = require("./dto/create-menu-item.dto");
const update_menu_item_dto_1 = require("./dto/update-menu-item.dto");
let CanteenController = class CanteenController {
    canteenService;
    constructor(canteenService) {
        this.canteenService = canteenService;
    }
    async getMenu() {
        return this.canteenService.getMenu();
    }
    async createMenuItem(body, req) {
        return this.canteenService.createMenuItem(body, req.user);
    }
    async updateMenuItem(id, body, req) {
        return this.canteenService.updateMenuItem(id, body, req.user);
    }
    async deleteMenuItem(id, req) {
        return this.canteenService.deleteMenuItem(id, req.user);
    }
    async undoMenuItemChange(req) {
        return this.canteenService.undoMenuItemChange(req.user);
    }
    async redoMenuItemChange(req) {
        return this.canteenService.redoMenuItemChange(req.user);
    }
};
exports.CanteenController = CanteenController;
__decorate([
    (0, common_1.Get)('menu'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy toàn bộ thực đơn đang bán (phân nhóm theo Category)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "getMenu", null);
__decorate([
    (0, common_1.Post)('admin/menu'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo mới món ăn' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_menu_item_dto_1.CreateMenuItemDto, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "createMenuItem", null);
__decorate([
    (0, common_1.Put)('admin/menu/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật thông tin món ăn' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_menu_item_dto_1.UpdateMenuItemDto, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "updateMenuItem", null);
__decorate([
    (0, common_1.Delete)('admin/menu/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa món ăn khỏi menu' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "deleteMenuItem", null);
__decorate([
    (0, common_1.Post)('admin/menu/undo'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Hoàn tác (Undo) thao tác sửa đổi vừa thực hiện trên Menu' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "undoMenuItemChange", null);
__decorate([
    (0, common_1.Post)('admin/menu/redo'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Làm lại (Redo) thao tác vừa hoàn tác trên Menu' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "redoMenuItemChange", null);
exports.CanteenController = CanteenController = __decorate([
    (0, swagger_1.ApiTags)('Api Canteen'),
    (0, common_1.Controller)('api/canteen'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    __metadata("design:paramtypes", [canteen_service_1.CanteenService])
], CanteenController);
//# sourceMappingURL=canteen.controller.js.map