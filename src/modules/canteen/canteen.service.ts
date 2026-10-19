import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';

import { UpstreamClient } from '../../common/http/upstream-client';
import type {
  GatewayUser,
  RequestWithContext,
} from '../../common/interfaces/request-context.interface';
import { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';
import type { CancelOrderDto } from './dto/cancel-order.dto';
import type { CategoryQueryDto } from './dto/category-query.dto';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { CreateMenuItemDto } from './dto/create-menu-item.dto';
import type { CreateOrderDto } from './dto/create-order.dto';
import type { CreateTableDto } from './dto/create-table.dto';
import type { OrderQueryDto } from './dto/order-query.dto';
import type { ReplyReviewDto } from './dto/reply-review.dto';
import type {
  ReviewQueryDto,
  ReviewSummaryQueryDto,
} from './dto/review-query.dto';
import type { TableQueryDto } from './dto/table-query.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';
import type { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import type { UpdateTableStatusDto } from './dto/update-table-status.dto';
import type { UpdateTableDto } from './dto/update-table.dto';
import type { UpsertReviewDto } from './dto/upsert-review.dto';

const MENU = '/api/canteen/menu';
const ADMIN_MENU = '/api/canteen/admin/menu';
const ORDERS = '/api/canteen/orders';
const REVIEWS = '/api/canteen/reviews';
const TABLES = '/api/canteen/tables';
const CATEGORIES = '/api/canteen/categories';

@Injectable({ scope: Scope.REQUEST })
export class CanteenService {
  private readonly upstream: UpstreamClient;

  constructor(
    httpService: HttpService,
    configService: ConfigService,
    signatureService: InternalRequestSignatureService,
    @Inject(REQUEST) request: RequestWithContext,
  ) {
    this.upstream = new UpstreamClient({
      httpService,
      signatureService,
      request,
      service: 'canteen',
      baseUrl: configService.get<string>(
        'CANTEEN_SERVICE_URL',
        'http://localhost:5005',
      ),
      label: 'Dịch vụ căn tin',
      // Hợp đồng của Canteen chỉ ký danh tính, không gắn với METHOD:path.
      signRoute: false,
    });
  }

  getMenu() {
    return this.upstream.get(MENU);
  }

  searchMenu(query: string) {
    return this.upstream.get(`${MENU}/search`, {
      params: query ? { q: query } : undefined,
    });
  }

  getAdminMenu(user: GatewayUser) {
    return this.upstream.get(ADMIN_MENU, { user });
  }

  createMenuItem(dto: CreateMenuItemDto, user: GatewayUser) {
    return this.upstream.post(ADMIN_MENU, dto, { user });
  }

  updateMenuItem(id: string, dto: UpdateMenuItemDto, user: GatewayUser) {
    return this.upstream.put(`${ADMIN_MENU}/${encodeURIComponent(id)}`, dto, {
      user,
    });
  }

  deleteMenuItem(id: string, user: GatewayUser) {
    return this.upstream.delete(`${ADMIN_MENU}/${encodeURIComponent(id)}`, {
      user,
    });
  }

  undoMenuItemChange(user: GatewayUser) {
    return this.upstream.post(`${ADMIN_MENU}/undo`, undefined, { user });
  }

  redoMenuItemChange(user: GatewayUser) {
    return this.upstream.post(`${ADMIN_MENU}/redo`, undefined, { user });
  }

  createOrder(dto: CreateOrderDto, user: GatewayUser) {
    return this.upstream.post(ORDERS, dto, { user });
  }

  getOrders(params: OrderQueryDto, user: GatewayUser) {
    return this.upstream.get(ORDERS, { params, user });
  }

  getMyOrders(user: GatewayUser) {
    return this.upstream.get(`${ORDERS}/my-orders`, { user });
  }

  getOrderById(id: string, user: GatewayUser) {
    return this.upstream.get(`${ORDERS}/${encodeURIComponent(id)}`, { user });
  }

  cancelOrder(id: string, dto: CancelOrderDto, user: GatewayUser) {
    return this.upstream.patch(
      `${ORDERS}/${encodeURIComponent(id)}/cancel`,
      dto,
      { user },
    );
  }

  confirmCashPayment(id: string, user: GatewayUser) {
    return this.upstream.patch(
      `${ORDERS}/${encodeURIComponent(id)}/payment/cash`,
      undefined,
      { user },
    );
  }

  upsertReview(id: string, dto: UpsertReviewDto, user: GatewayUser) {
    return this.upstream.put(
      `${ORDERS}/${encodeURIComponent(id)}/review`,
      dto,
      { user },
    );
  }

  getMyReviews(user: GatewayUser) {
    return this.upstream.get(`${REVIEWS}/my`, { user });
  }

  getReviewSummary(params: ReviewSummaryQueryDto, user: GatewayUser) {
    return this.upstream.get(`${REVIEWS}/summary`, { params, user });
  }

  getReviews(params: ReviewQueryDto, user: GatewayUser) {
    return this.upstream.get(REVIEWS, { params, user });
  }

  replyToReview(id: string, dto: ReplyReviewDto, user: GatewayUser) {
    return this.upstream.patch(
      `${REVIEWS}/${encodeURIComponent(id)}/reply`,
      dto,
      { user },
    );
  }

  getAllTables(params: TableQueryDto, user: GatewayUser) {
    return this.upstream.get(TABLES, { params, user });
  }

  getTableById(id: string, user: GatewayUser) {
    return this.upstream.get(`${TABLES}/${encodeURIComponent(id)}`, { user });
  }

  createTable(dto: CreateTableDto, user: GatewayUser) {
    return this.upstream.post(TABLES, dto, { user });
  }

  updateTable(id: string, dto: UpdateTableDto, user: GatewayUser) {
    return this.upstream.patch(`${TABLES}/${encodeURIComponent(id)}`, dto, {
      user,
    });
  }

  deleteTable(id: string, user: GatewayUser) {
    return this.upstream.delete(`${TABLES}/${encodeURIComponent(id)}`, {
      user,
    });
  }

  updateTableStatus(id: string, dto: UpdateTableStatusDto, user: GatewayUser) {
    return this.upstream.patch(
      `${TABLES}/${encodeURIComponent(id)}/status`,
      dto,
      { user },
    );
  }

  getCategories(params: CategoryQueryDto) {
    return this.upstream.get(CATEGORIES, { params });
  }

  getCategoryById(id: string) {
    return this.upstream.get(`${CATEGORIES}/${encodeURIComponent(id)}`);
  }

  createCategory(dto: CreateCategoryDto, user: GatewayUser) {
    return this.upstream.post(CATEGORIES, dto, { user });
  }

  updateCategory(id: string, dto: UpdateCategoryDto, user: GatewayUser) {
    return this.upstream.patch(`${CATEGORIES}/${encodeURIComponent(id)}`, dto, {
      user,
    });
  }

  deleteCategory(id: string, user: GatewayUser) {
    return this.upstream.delete(`${CATEGORIES}/${encodeURIComponent(id)}`, {
      user,
    });
  }
}
