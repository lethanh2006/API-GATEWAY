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
exports.CanteenService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let CanteenService = class CanteenService {
    httpService;
    configService;
    baseUrl;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.baseUrl = this.configService.get('CANTEEN_SERVICE_URL', 'http://localhost:5005');
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
    async getMenu() {
        return this.forward('GET', '/api/canteen/menu');
    }
    async searchMenu(query) {
        const params = query ? { q: query } : undefined;
        return this.forward('GET', '/api/canteen/menu/search', null, params);
    }
    async createMenuItem(dto, user) {
        return this.forward('POST', '/api/canteen/admin/menu', dto, null, user);
    }
    async updateMenuItem(id, dto, user) {
        return this.forward('PUT', `/api/canteen/admin/menu/${id}`, dto, null, user);
    }
    async deleteMenuItem(id, user) {
        return this.forward('DELETE', `/api/canteen/admin/menu/${id}`, null, null, user);
    }
    async undoMenuItemChange(user) {
        return this.forward('POST', '/api/canteen/admin/menu/undo', null, null, user);
    }
    async redoMenuItemChange(user) {
        return this.forward('POST', '/api/canteen/admin/menu/redo', null, null, user);
    }
    async createOrder(dto, user) {
        return this.forward('POST', '/api/canteen/orders', dto, null, user);
    }
    async getMyOrders(user) {
        return this.forward('GET', '/api/canteen/orders/my-orders', null, null, user);
    }
    async getOrderById(id, user) {
        return this.forward('GET', `/api/canteen/orders/${id}`, null, null, user);
    }
    async confirmOrder(id, user) {
        return this.forward('PATCH', `/api/canteen/orders/${id}/confirm`, null, null, user);
    }
    async completeOrder(id, user) {
        return this.forward('PATCH', `/api/canteen/orders/${id}/complete`, null, null, user);
    }
    async getKitchenQueue(user) {
        return this.forward('GET', '/api/canteen/kitchen/queue', null, null, user);
    }
    async getNextKitchenOrder(user) {
        return this.forward('POST', '/api/canteen/kitchen/next', null, null, user);
    }
    async setKitchenOrderCooking(id, user) {
        return this.forward('PATCH', `/api/canteen/kitchen/orders/${id}/cooking`, null, null, user);
    }
    async setKitchenOrderReady(id, user) {
        return this.forward('PATCH', `/api/canteen/kitchen/orders/${id}/ready`, null, null, user);
    }
    async getAllTables() {
        return this.forward('GET', '/api/canteen/tables');
    }
    async getTableById(id) {
        return this.forward('GET', `/api/canteen/tables/${id}`);
    }
    async createTable(dto, user) {
        return this.forward('POST', '/api/canteen/tables', dto, null, user);
    }
    async updateTableStatus(id, dto, user) {
        return this.forward('PATCH', `/api/canteen/tables/${id}/status`, dto, null, user);
    }
    async allocateTables(dto, user) {
        return this.forward('POST', '/api/canteen/tables/allocate', dto, null, user);
    }
    async createIngredient(dto, user) {
        return this.forward('POST', '/api/canteen/inventory/ingredients', dto, null, user);
    }
    async createInventoryBatch(dto, user) {
        return this.forward('POST', '/api/canteen/inventory/batches', dto, null, user);
    }
    async getInventoryExpiryAlerts(user) {
        return this.forward('GET', '/api/canteen/inventory/expiry-alerts', null, null, user);
    }
    async consumeIngredient(dto, user) {
        return this.forward('POST', '/api/canteen/inventory/consume', dto, null, user);
    }
    async getTopDishes(limit, user) {
        const params = limit ? { limit } : undefined;
        return this.forward('GET', '/api/canteen/analytics/top-dishes', null, params, user);
    }
};
exports.CanteenService = CanteenService;
exports.CanteenService = CanteenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], CanteenService);
//# sourceMappingURL=canteen.service.js.map