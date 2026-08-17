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
const create_order_dto_1 = require("./dto/create-order.dto");
const create_ingredient_dto_1 = require("./dto/create-ingredient.dto");
const create_inventory_batch_dto_1 = require("./dto/create-inventory-batch.dto");
const consume_ingredient_dto_1 = require("./dto/consume-ingredient.dto");
const create_table_dto_1 = require("./dto/create-table.dto");
const update_table_status_dto_1 = require("./dto/update-table-status.dto");
const allocate_table_dto_1 = require("./dto/allocate-table.dto");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
const category_query_dto_1 = require("./dto/category-query.dto");
const update_table_dto_1 = require("./dto/update-table.dto");
const table_query_dto_1 = require("./dto/table-query.dto");
const update_ingredient_dto_1 = require("./dto/update-ingredient.dto");
const ingredient_query_dto_1 = require("./dto/ingredient-query.dto");
let CanteenController = class CanteenController {
    canteenService;
    constructor(canteenService) {
        this.canteenService = canteenService;
    }
    async getMenu() {
        return this.canteenService.getMenu();
    }
    async searchMenu(query) {
        return this.canteenService.searchMenu(query || '');
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
    async createOrder(body, req) {
        return this.canteenService.createOrder(body, req.user);
    }
    async getMyOrders(req) {
        return this.canteenService.getMyOrders(req.user);
    }
    async getOrderById(id, req) {
        return this.canteenService.getOrderById(id, req.user);
    }
    async confirmOrder(id, req) {
        return this.canteenService.confirmOrder(id, req.user);
    }
    async completeOrder(id, req) {
        return this.canteenService.completeOrder(id, req.user);
    }
    async getKitchenQueue(req) {
        return this.canteenService.getKitchenQueue(req.user);
    }
    async getNextKitchenOrder(req) {
        return this.canteenService.getNextKitchenOrder(req.user);
    }
    async setKitchenOrderCooking(id, req) {
        return this.canteenService.setKitchenOrderCooking(id, req.user);
    }
    async setKitchenOrderReady(id, req) {
        return this.canteenService.setKitchenOrderReady(id, req.user);
    }
    async getAllTables(query) {
        return this.canteenService.getAllTables(query);
    }
    async getTableById(id) {
        return this.canteenService.getTableById(id);
    }
    async createTable(body, req) {
        return this.canteenService.createTable(body, req.user);
    }
    async updateTable(id, body, req) {
        return this.canteenService.updateTable(id, body, req.user);
    }
    async deleteTable(id, req) {
        return this.canteenService.deleteTable(id, req.user);
    }
    async updateTableStatus(id, body, req) {
        return this.canteenService.updateTableStatus(id, body, req.user);
    }
    async allocateTables(body, req) {
        return this.canteenService.allocateTables(body, req.user);
    }
    async getIngredients(query) {
        return this.canteenService.getIngredients(query);
    }
    async getIngredientById(id) {
        return this.canteenService.getIngredientById(id);
    }
    async createIngredient(body, req) {
        return this.canteenService.createIngredient(body, req.user);
    }
    async updateIngredient(id, body, req) {
        return this.canteenService.updateIngredient(id, body, req.user);
    }
    async deleteIngredient(id, req) {
        return this.canteenService.deleteIngredient(id, req.user);
    }
    async createInventoryBatch(body, req) {
        return this.canteenService.createInventoryBatch(body, req.user);
    }
    async getInventoryExpiryAlerts(req) {
        return this.canteenService.getInventoryExpiryAlerts(req.user);
    }
    async consumeIngredient(body, req) {
        return this.canteenService.consumeIngredient(body, req.user);
    }
    async getTopDishes(limit, req) {
        return this.canteenService.getTopDishes(limit, req.user);
    }
    async getCategories(query) {
        return this.canteenService.getCategories(query);
    }
    async getCategoryById(id) {
        return this.canteenService.getCategoryById(id);
    }
    async createCategory(body, req) {
        return this.canteenService.createCategory(body, req.user);
    }
    async updateCategory(id, body, req) {
        return this.canteenService.updateCategory(id, body, req.user);
    }
    async deleteCategory(id, req) {
        return this.canteenService.deleteCategory(id, req.user);
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
    (0, common_1.Get)('menu/search'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tìm kiếm món ăn real-time bằng thuật toán Trie Prefix Tree' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "searchMenu", null);
__decorate([
    (0, common_1.Post)('admin/menu'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo mới món ăn (ADMIN,MANAGER)' }),
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
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật thông tin món ăn (ADMIN,MANAGER)' }),
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
    (0, swagger_1.ApiOperation)({ summary: 'Xóa món ăn khỏi menu (ADMIN,MANAGER)' }),
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
    (0, swagger_1.ApiOperation)({ summary: 'Hoàn tác (Undo) thao tác sửa đổi vừa thực hiện trên Menu (ADMIN,MANAGER)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "undoMenuItemChange", null);
__decorate([
    (0, common_1.Post)('admin/menu/redo'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Làm lại (Redo) thao tác vừa hoàn tác trên Menu (ADMIN,MANAGER)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "redoMenuItemChange", null);
__decorate([
    (0, common_1.Post)('orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo giỏ hàng và đặt món (Trạng thái ban đầu: CREATED)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('orders/my-orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Xem lịch sử đơn hàng cá nhân' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "getMyOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin chi tiết của một đơn hàng' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Patch)('orders/:id/confirm'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Xác nhận đơn hàng, tính điểm ưu tiên và gửi sự kiện chế biến (ADMIN,MANAGER)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "confirmOrder", null);
__decorate([
    (0, common_1.Patch)('orders/:id/complete'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Xác nhận khách đã nhận món ăn thành công, đóng Order (ADMIN,MANAGER)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "completeOrder", null);
__decorate([
    (0, common_1.Get)('kitchen/queue'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER, role_enum_1.Role.CHEF),
    (0, swagger_1.ApiOperation)({ summary: 'Xem danh sách các đơn hàng đang chờ trong hàng đợi ưu tiên (ADMIN,MANAGER,CHEF)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "getKitchenQueue", null);
__decorate([
    (0, common_1.Post)('kitchen/next'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER, role_enum_1.Role.CHEF),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy đơn hàng có độ ưu tiên cao nhất ra khỏi hàng đợi để chế biến (ADMIN,MANAGER,CHEF)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "getNextKitchenOrder", null);
__decorate([
    (0, common_1.Patch)('kitchen/orders/:id/cooking'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER, role_enum_1.Role.CHEF),
    (0, swagger_1.ApiOperation)({ summary: 'Chuyển trạng thái đơn hàng sang COOKING (ADMIN,MANAGER,CHEF)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "setKitchenOrderCooking", null);
__decorate([
    (0, common_1.Patch)('kitchen/orders/:id/ready'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER, role_enum_1.Role.CHEF),
    (0, swagger_1.ApiOperation)({ summary: 'Đánh dấu món ăn đã chuẩn bị xong, chuyển trạng thái READY (ADMIN,MANAGER,CHEF)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "setKitchenOrderReady", null);
__decorate([
    (0, common_1.Get)('tables'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách tất cả các bàn ăn' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [table_query_dto_1.TableQueryDto]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "getAllTables", null);
__decorate([
    (0, common_1.Get)('tables/:id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin bàn ăn theo ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "getTableById", null);
__decorate([
    (0, common_1.Post)('tables'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Khởi tạo bàn ăn mới (ADMIN,MANAGER)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_table_dto_1.CreateTableDto, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "createTable", null);
__decorate([
    (0, common_1.Patch)('tables/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật thông tin bàn ăn (ADMIN,MANAGER)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_table_dto_1.UpdateTableDto, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "updateTable", null);
__decorate([
    (0, common_1.Delete)('tables/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa bàn ăn đang trống (ADMIN,MANAGER)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "deleteTable", null);
__decorate([
    (0, common_1.Patch)('tables/:id/status'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER, role_enum_1.Role.WAITER),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật trạng thái bàn ăn (empty, occupied, reserved) (ADMIN,MANAGER,WAITER)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_table_status_dto_1.UpdateTableStatusDto, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "updateTableStatus", null);
__decorate([
    (0, common_1.Post)('tables/allocate'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER, role_enum_1.Role.WAITER),
    (0, swagger_1.ApiOperation)({ summary: 'Giải thuật Phân Bổ & Gộp Bàn Tự Động cho nhóm khách (ADMIN,MANAGER,WAITER)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [allocate_table_dto_1.AllocateTableDto, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "allocateTables", null);
__decorate([
    (0, common_1.Get)('inventory/ingredients'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách nguyên liệu' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ingredient_query_dto_1.IngredientQueryDto]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "getIngredients", null);
__decorate([
    (0, common_1.Get)('inventory/ingredients/:id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin nguyên liệu theo ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "getIngredientById", null);
__decorate([
    (0, common_1.Post)('inventory/ingredients'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Khởi tạo nguyên liệu mới (ADMIN,MANAGER)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ingredient_dto_1.CreateIngredientDto, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "createIngredient", null);
__decorate([
    (0, common_1.Patch)('inventory/ingredients/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật nguyên liệu (ADMIN,MANAGER)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ingredient_dto_1.UpdateIngredientDto, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "updateIngredient", null);
__decorate([
    (0, common_1.Delete)('inventory/ingredients/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa nguyên liệu chưa có lô kho (ADMIN,MANAGER)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "deleteIngredient", null);
__decorate([
    (0, common_1.Post)('inventory/batches'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Nhập lô hàng mới (đẩy vào Min Heap quản lý hạn sử dụng) (ADMIN,MANAGER)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_batch_dto_1.CreateInventoryBatchDto, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "createInventoryBatch", null);
__decorate([
    (0, common_1.Get)('inventory/expiry-alerts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER, role_enum_1.Role.CHEF),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách nguyên liệu sắp hết hạn cần sử dụng trước (Min Heap) (ADMIN,MANAGER,CHEF)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "getInventoryExpiryAlerts", null);
__decorate([
    (0, common_1.Post)('inventory/consume'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER, role_enum_1.Role.CHEF),
    (0, swagger_1.ApiOperation)({ summary: 'Khấu trừ nguyên liệu sau khi nấu ăn (tự động trừ lô hết hạn trước) (ADMIN,MANAGER,CHEF)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [consume_ingredient_dto_1.ConsumeIngredientDto, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "consumeIngredient", null);
__decorate([
    (0, common_1.Get)('analytics/top-dishes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Trả về Top K món ăn bán chạy nhất (sử dụng Top-K Min Heap) (ADMIN,MANAGER)' }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "getTopDishes", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách danh mục món ăn' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_query_dto_1.CategoryQueryDto]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin danh mục theo ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "getCategoryById", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo danh mục món ăn (ADMIN,MANAGER)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)('categories/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật danh mục món ăn (ADMIN,MANAGER)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_1.UpdateCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa danh mục món ăn (ADMIN,MANAGER)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CanteenController.prototype, "deleteCategory", null);
exports.CanteenController = CanteenController = __decorate([
    (0, swagger_1.ApiTags)('Api Canteen'),
    (0, common_1.Controller)('api/canteen'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    __metadata("design:paramtypes", [canteen_service_1.CanteenService])
], CanteenController);
//# sourceMappingURL=canteen.controller.js.map