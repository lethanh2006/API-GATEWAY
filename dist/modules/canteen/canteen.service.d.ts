import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class CanteenService {
    private readonly httpService;
    private readonly configService;
    private readonly baseUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    private forward;
    getMenu(): Promise<any>;
    createMenuItem(dto: any, user: any): Promise<any>;
    updateMenuItem(id: string, dto: any, user: any): Promise<any>;
    deleteMenuItem(id: string, user: any): Promise<any>;
    undoMenuItemChange(user: any): Promise<any>;
    redoMenuItemChange(user: any): Promise<any>;
    createOrder(dto: any, user: any): Promise<any>;
    getMyOrders(user: any): Promise<any>;
    getOrderById(id: string, user: any): Promise<any>;
    confirmOrder(id: string, user: any): Promise<any>;
    completeOrder(id: string, user: any): Promise<any>;
    getKitchenQueue(user: any): Promise<any>;
    getNextKitchenOrder(user: any): Promise<any>;
    setKitchenOrderCooking(id: string, user: any): Promise<any>;
    setKitchenOrderReady(id: string, user: any): Promise<any>;
    createIngredient(dto: any, user: any): Promise<any>;
    createInventoryBatch(dto: any, user: any): Promise<any>;
    getInventoryExpiryAlerts(user: any): Promise<any>;
    consumeIngredient(dto: any, user: any): Promise<any>;
    getTopDishes(limit: number, user: any): Promise<any>;
}
