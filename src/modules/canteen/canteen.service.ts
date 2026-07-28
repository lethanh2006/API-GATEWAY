import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CanteenService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.baseUrl = this.configService.get<string>('CANTEEN_SERVICE_URL', 'http://localhost:5005');
  }

  private async forward(method: string, path: string, data?: any, params?: any, user?: any) {
    const headers: Record<string, string> = {};
    if (user) {
      const userPayloadStr = JSON.stringify(user);
      const base64User = Buffer.from(userPayloadStr).toString('base64');
      headers['x-user-payload'] = base64User;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url: `${this.baseUrl}${path}`,
          data,
          params,
          headers,
        })
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      throw error;
    }
  }

  // --- Menu APIs ---
  async getMenu() {
    return this.forward('GET', '/api/canteen/menu');
  }

  async createMenuItem(dto: any, user: any) {
    return this.forward('POST', '/api/canteen/admin/menu', dto, null, user);
  }

  async updateMenuItem(id: string, dto: any, user: any) {
    return this.forward('PUT', `/api/canteen/admin/menu/${id}`, dto, null, user);
  }

  async deleteMenuItem(id: string, user: any) {
    return this.forward('DELETE', `/api/canteen/admin/menu/${id}`, null, null, user);
  }

  async undoMenuItemChange(user: any) {
    return this.forward('POST', '/api/canteen/admin/menu/undo', null, null, user);
  }

  async redoMenuItemChange(user: any) {
    return this.forward('POST', '/api/canteen/admin/menu/redo', null, null, user);
  }

  // --- Order APIs ---
  async createOrder(dto: any, user: any) {
    return this.forward('POST', '/api/canteen/orders', dto, null, user);
  }

  async getMyOrders(user: any) {
    return this.forward('GET', '/api/canteen/orders/my-orders', null, null, user);
  }

  async getOrderById(id: string, user: any) {
    return this.forward('GET', `/api/canteen/orders/${id}`, null, null, user);
  }

  async confirmOrder(id: string, user: any) {
    return this.forward('PATCH', `/api/canteen/orders/${id}/confirm`, null, null, user);
  }

  async completeOrder(id: string, user: any) {
    return this.forward('PATCH', `/api/canteen/orders/${id}/complete`, null, null, user);
  }

  // --- Kitchen APIs ---
  async getKitchenQueue(user: any) {
    return this.forward('GET', '/api/canteen/kitchen/queue', null, null, user);
  }

  async getNextKitchenOrder(user: any) {
    return this.forward('POST', '/api/canteen/kitchen/next', null, null, user);
  }

  async setKitchenOrderCooking(id: string, user: any) {
    return this.forward('PATCH', `/api/canteen/kitchen/orders/${id}/cooking`, null, null, user);
  }

  async setKitchenOrderReady(id: string, user: any) {
    return this.forward('PATCH', `/api/canteen/kitchen/orders/${id}/ready`, null, null, user);
  }

  // --- Inventory APIs ---
  async createIngredient(dto: any, user: any) {
    return this.forward('POST', '/api/canteen/inventory/ingredients', dto, null, user);
  }

  async createInventoryBatch(dto: any, user: any) {
    return this.forward('POST', '/api/canteen/inventory/batches', dto, null, user);
  }

  async getInventoryExpiryAlerts(user: any) {
    return this.forward('GET', '/api/canteen/inventory/expiry-alerts', null, null, user);
  }

  async consumeIngredient(dto: any, user: any) {
    return this.forward('POST', '/api/canteen/inventory/consume', dto, null, user);
  }
}


