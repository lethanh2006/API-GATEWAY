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
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "createMenuItem", null);
exports.CanteenController = CanteenController = __decorate([
    (0, swagger_1.ApiTags)('Api Canteen'),
    (0, common_1.Controller)('api/canteen'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    __metadata("design:paramtypes", [canteen_service_1.CanteenService])
], CanteenController);
//# sourceMappingURL=canteen.controller.js.map