import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { CanteenService } from './canteen.service';
import { JwtAuthGuard } from '../auth/common/guard/jwt/jwt.guard';
import { RolesGuard } from '../auth/common/guard/role/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '../../common/enums/role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { CreateInventoryBatchDto } from './dto/create-inventory-batch.dto';
import { ConsumeIngredientDto } from './dto/consume-ingredient.dto';

@ApiTags('Api Canteen')
@Controller('api/canteen')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CanteenController {
  constructor(private readonly canteenService: CanteenService) {}

  // --- 3.1 Nhóm API Thực Đơn (Menu APIs) ---

  @Get('menu')
  @Public()
  @ApiOperation({ summary: 'Lấy toàn bộ thực đơn đang bán (phân nhóm theo Category)' })
  async getMenu() {
    return this.canteenService.getMenu();
  }

  @Post('admin/menu')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Tạo mới món ăn' })
  async createMenuItem(@Body() body: CreateMenuItemDto, @Req() req: any) {
    return this.canteenService.createMenuItem(body, req.user);
  }

  @Put('admin/menu/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Cập nhật thông tin món ăn' })
  async updateMenuItem(
    @Param('id') id: string,
    @Body() body: UpdateMenuItemDto,
    @Req() req: any,
  ) {
    return this.canteenService.updateMenuItem(id, body, req.user);
  }

  @Delete('admin/menu/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Xóa món ăn khỏi menu' })
  async deleteMenuItem(@Param('id') id: string, @Req() req: any) {
    return this.canteenService.deleteMenuItem(id, req.user);
  }

  @Post('admin/menu/undo')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Hoàn tác (Undo) thao tác sửa đổi vừa thực hiện trên Menu' })
  async undoMenuItemChange(@Req() req: any) {
    return this.canteenService.undoMenuItemChange(req.user);
  }

  @Post('admin/menu/redo')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Làm lại (Redo) thao tác vừa hoàn tác trên Menu' })
  async redoMenuItemChange(@Req() req: any) {
    return this.canteenService.redoMenuItemChange(req.user);
  }

  // --- 3.2 Nhóm API Đơn Hàng (Order APIs) ---

  @Post('orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo giỏ hàng và đặt món (Trạng thái ban đầu: CREATED)' })
  async createOrder(@Body() body: CreateOrderDto, @Req() req: any) {
    return this.canteenService.createOrder(body, req.user);
  }

  @Get('orders/my-orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xem lịch sử đơn hàng cá nhân' })
  async getMyOrders(@Req() req: any) {
    return this.canteenService.getMyOrders(req.user);
  }

  @Get('orders/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin chi tiết của một đơn hàng' })
  async getOrderById(@Param('id') id: string, @Req() req: any) {
    return this.canteenService.getOrderById(id, req.user);
  }

  @Patch('orders/:id/confirm')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Xác nhận đơn hàng, tính điểm ưu tiên và gửi sự kiện chế biến' })
  async confirmOrder(@Param('id') id: string, @Req() req: any) {
    return this.canteenService.confirmOrder(id, req.user);
  }

  @Patch('orders/:id/complete')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Xác nhận khách đã nhận món ăn thành công, đóng Order' })
  async completeOrder(@Param('id') id: string, @Req() req: any) {
    return this.canteenService.completeOrder(id, req.user);
  }

  // --- 3.3 Nhóm API Nhà Bếp (Kitchen APIs) ---

  @Get('kitchen/queue')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Xem danh sách các đơn hàng đang chờ trong hàng đợi ưu tiên' })
  async getKitchenQueue(@Req() req: any) {
    return this.canteenService.getKitchenQueue(req.user);
  }

  @Post('kitchen/next')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Lấy đơn hàng có độ ưu tiên cao nhất ra khỏi hàng đợi để chế biến' })
  async getNextKitchenOrder(@Req() req: any) {
    return this.canteenService.getNextKitchenOrder(req.user);
  }

  @Patch('kitchen/orders/:id/cooking')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Chuyển trạng thái đơn hàng sang COOKING' })
  async setKitchenOrderCooking(@Param('id') id: string, @Req() req: any) {
    return this.canteenService.setKitchenOrderCooking(id, req.user);
  }

  @Patch('kitchen/orders/:id/ready')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Đánh dấu món ăn đã chuẩn bị xong, chuyển trạng thái READY' })
  async setKitchenOrderReady(@Param('id') id: string, @Req() req: any) {
    return this.canteenService.setKitchenOrderReady(id, req.user);
  }

  // --- 3.4 Nhóm API Quản Lý Kho (Inventory APIs) ---

  @Post('inventory/ingredients')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Khởi tạo nguyên liệu mới' })
  async createIngredient(@Body() body: CreateIngredientDto, @Req() req: any) {
    return this.canteenService.createIngredient(body, req.user);
  }

  @Post('inventory/batches')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Nhập lô hàng mới (đẩy vào Min Heap quản lý hạn sử dụng)' })
  async createInventoryBatch(@Body() body: CreateInventoryBatchDto, @Req() req: any) {
    return this.canteenService.createInventoryBatch(body, req.user);
  }

  @Get('inventory/expiry-alerts')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Lấy danh sách nguyên liệu sắp hết hạn cần sử dụng trước (Min Heap)' })
  async getInventoryExpiryAlerts(@Req() req: any) {
    return this.canteenService.getInventoryExpiryAlerts(req.user);
  }

  @Post('inventory/consume')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Khấu trừ nguyên liệu sau khi nấu ăn (tự động trừ lô hết hạn trước)' })
  async consumeIngredient(@Body() body: ConsumeIngredientDto, @Req() req: any) {
    return this.canteenService.consumeIngredient(body, req.user);
  }

  // --- 3.5 Nhóm API Báo Cáo & Phân Tích (Analytics APIs) ---

  @Get('analytics/top-dishes')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Trả về Top K món ăn bán chạy nhất (sử dụng Top-K Min Heap)' })
  async getTopDishes(@Query('limit') limit: number, @Req() req: any) {
    return this.canteenService.getTopDishes(limit, req.user);
  }
}



