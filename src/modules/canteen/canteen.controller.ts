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
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableStatusDto } from './dto/update-table-status.dto';
import { AllocateTableDto } from './dto/allocate-table.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TableQueryDto } from './dto/table-query.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientQueryDto } from './dto/ingredient-query.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';

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

  @Get('menu/search')
  @Public()
  @ApiOperation({ summary: 'Tìm kiếm món ăn real-time bằng thuật toán Trie Prefix Tree' })
  async searchMenu(@Query('q') query: string) {
    return this.canteenService.searchMenu(query || '');
  }

  @Get('admin/menu')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Lấy toàn bộ món và danh mục, kể cả dữ liệu đang ẩn' })
  async getAdminMenu(@Req() req: any) {
    return this.canteenService.getAdminMenu(req.user);
  }

  @Post('admin/menu')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Tạo mới món ăn (ADMIN,MANAGER)' })
  async createMenuItem(@Body() body: CreateMenuItemDto, @Req() req: any) {
    return this.canteenService.createMenuItem(body, req.user);
  }

  @Put('admin/menu/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Cập nhật thông tin món ăn (ADMIN,MANAGER)' })
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
  @ApiOperation({ summary: 'Xóa món ăn khỏi menu (ADMIN,MANAGER)' })
  async deleteMenuItem(@Param('id') id: string, @Req() req: any) {
    return this.canteenService.deleteMenuItem(id, req.user);
  }

  @Post('admin/menu/undo')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Hoàn tác (Undo) thao tác sửa đổi vừa thực hiện trên Menu (ADMIN,MANAGER)' })
  async undoMenuItemChange(@Req() req: any) {
    return this.canteenService.undoMenuItemChange(req.user);
  }

  @Post('admin/menu/redo')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Làm lại (Redo) thao tác vừa hoàn tác trên Menu (ADMIN,MANAGER)' })
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

  @Get('orders')
  @ApiBearerAuth()
  @Roles(
    Role.ADMIN,
    Role.MANAGER,
    Role.CASHIER,
    Role.WAITER,
    Role.CHEF,
  )
  @ApiOperation({
    summary: 'Lấy danh sách đơn hàng có lọc và phân trang cho nhân viên vận hành',
  })
  async getOrders(@Query() query: OrderQueryDto, @Req() req: any) {
    return this.canteenService.getOrders(query, req.user);
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

  @Patch('orders/:id/cancel')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Hủy đơn hàng (chủ đơn hoặc nhân viên có quyền vận hành)',
  })
  async cancelOrder(
    @Param('id') id: string,
    @Body() body: CancelOrderDto,
    @Req() req: any,
  ) {
    return this.canteenService.cancelOrder(id, body, req.user);
  }

  @Patch('orders/:id/confirm')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CASHIER, Role.WAITER)
  @ApiOperation({
    summary:
      'Xác nhận đơn hàng, tính điểm ưu tiên và gửi sự kiện chế biến (ADMIN,MANAGER,CASHIER,WAITER)',
  })
  async confirmOrder(@Param('id') id: string, @Req() req: any) {
    return this.canteenService.confirmOrder(id, req.user);
  }

  @Patch('orders/:id/complete')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CASHIER, Role.WAITER)
  @ApiOperation({
    summary:
      'Xác nhận khách đã nhận món ăn thành công, đóng Order (ADMIN,MANAGER,CASHIER,WAITER)',
  })
  async completeOrder(@Param('id') id: string, @Req() req: any) {
    return this.canteenService.completeOrder(id, req.user);
  }

  // --- 3.3 Nhóm API Nhà Bếp (Kitchen APIs) ---

  @Get('kitchen/queue')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Xem danh sách các đơn hàng đang chờ trong hàng đợi ưu tiên (ADMIN,MANAGER,CHEF)' })
  async getKitchenQueue(@Req() req: any) {
    return this.canteenService.getKitchenQueue(req.user);
  }

  @Post('kitchen/next')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Lấy đơn hàng có độ ưu tiên cao nhất ra khỏi hàng đợi để chế biến (ADMIN,MANAGER,CHEF)' })
  async getNextKitchenOrder(@Req() req: any) {
    return this.canteenService.getNextKitchenOrder(req.user);
  }

  @Patch('kitchen/orders/:id/cooking')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Chuyển trạng thái đơn hàng sang COOKING (ADMIN,MANAGER,CHEF)' })
  async setKitchenOrderCooking(@Param('id') id: string, @Req() req: any) {
    return this.canteenService.setKitchenOrderCooking(id, req.user);
  }

  @Patch('kitchen/orders/:id/ready')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Đánh dấu món ăn đã chuẩn bị xong, chuyển trạng thái READY (ADMIN,MANAGER,CHEF)' })
  async setKitchenOrderReady(@Param('id') id: string, @Req() req: any) {
    return this.canteenService.setKitchenOrderReady(id, req.user);
  }

  // --- 3.4 Nhóm API Quản Lý Bàn Ăn (Table APIs) ---

  @Get('tables')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách tất cả các bàn ăn' })
  async getAllTables(@Query() query: TableQueryDto) {
    return this.canteenService.getAllTables(query);
  }

  @Get('tables/:id')
  @Public()
  @ApiOperation({ summary: 'Lấy thông tin bàn ăn theo ID' })
  async getTableById(@Param('id') id: string) {
    return this.canteenService.getTableById(id);
  }

  @Post('tables')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Khởi tạo bàn ăn mới (ADMIN,MANAGER)' })
  async createTable(@Body() body: CreateTableDto, @Req() req: any) {
    return this.canteenService.createTable(body, req.user);
  }

  @Patch('tables/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Cập nhật thông tin bàn ăn (ADMIN,MANAGER)' })
  async updateTable(
    @Param('id') id: string,
    @Body() body: UpdateTableDto,
    @Req() req: any,
  ) {
    return this.canteenService.updateTable(id, body, req.user);
  }

  @Delete('tables/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Xóa bàn ăn đang trống (ADMIN,MANAGER)' })
  async deleteTable(@Param('id') id: string, @Req() req: any) {
    return this.canteenService.deleteTable(id, req.user);
  }

  @Patch('tables/:id/status')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.WAITER)
  @ApiOperation({ summary: 'Cập nhật trạng thái bàn ăn (empty, occupied, reserved) (ADMIN,MANAGER,WAITER)' })
  async updateTableStatus(
    @Param('id') id: string,
    @Body() body: UpdateTableStatusDto,
    @Req() req: any,
  ) {
    return this.canteenService.updateTableStatus(id, body, req.user);
  }

  @Post('tables/allocate')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.WAITER)
  @ApiOperation({ summary: 'Giải thuật Phân Bổ & Gộp Bàn Tự Động cho nhóm khách (ADMIN,MANAGER,WAITER)' })
  async allocateTables(@Body() body: AllocateTableDto, @Req() req: any) {
    return this.canteenService.allocateTables(body, req.user);
  }

  // --- 3.5 Nhóm API Quản Lý Kho (Inventory APIs) ---

  @Get('inventory/ingredients')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách nguyên liệu' })
  async getIngredients(@Query() query: IngredientQueryDto) {
    return this.canteenService.getIngredients(query);
  }

  @Get('inventory/ingredients/:id')
  @Public()
  @ApiOperation({ summary: 'Lấy thông tin nguyên liệu theo ID' })
  async getIngredientById(@Param('id') id: string) {
    return this.canteenService.getIngredientById(id);
  }

  @Post('inventory/ingredients')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Khởi tạo nguyên liệu mới (ADMIN,MANAGER)' })
  async createIngredient(@Body() body: CreateIngredientDto, @Req() req: any) {
    return this.canteenService.createIngredient(body, req.user);
  }

  @Patch('inventory/ingredients/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Cập nhật nguyên liệu (ADMIN,MANAGER)' })
  async updateIngredient(
    @Param('id') id: string,
    @Body() body: UpdateIngredientDto,
    @Req() req: any,
  ) {
    return this.canteenService.updateIngredient(id, body, req.user);
  }

  @Delete('inventory/ingredients/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Xóa nguyên liệu chưa có lô kho (ADMIN,MANAGER)' })
  async deleteIngredient(@Param('id') id: string, @Req() req: any) {
    return this.canteenService.deleteIngredient(id, req.user);
  }

  @Post('inventory/batches')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Nhập lô hàng mới (đẩy vào Min Heap quản lý hạn sử dụng) (ADMIN,MANAGER)' })
  async createInventoryBatch(@Body() body: CreateInventoryBatchDto, @Req() req: any) {
    return this.canteenService.createInventoryBatch(body, req.user);
  }

  @Get('inventory/expiry-alerts')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Lấy danh sách nguyên liệu sắp hết hạn cần sử dụng trước (Min Heap) (ADMIN,MANAGER,CHEF)' })
  async getInventoryExpiryAlerts(@Req() req: any) {
    return this.canteenService.getInventoryExpiryAlerts(req.user);
  }

  @Post('inventory/consume')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Khấu trừ nguyên liệu sau khi nấu ăn (tự động trừ lô hết hạn trước) (ADMIN,MANAGER,CHEF)' })
  async consumeIngredient(@Body() body: ConsumeIngredientDto, @Req() req: any) {
    return this.canteenService.consumeIngredient(body, req.user);
  }

  // --- 3.6 Nhóm API Báo Cáo & Phân Tích (Analytics APIs) ---

  @Get('analytics/top-dishes')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Trả về Top K món ăn bán chạy nhất (sử dụng Top-K Min Heap) (ADMIN,MANAGER)' })
  async getTopDishes(@Query('limit') limit: number, @Req() req: any) {
    return this.canteenService.getTopDishes(limit, req.user);
  }

  // --- 3.7 Nhóm API Quản Lý Danh Mục (Category APIs) ---

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách danh mục món ăn' })
  async getCategories(@Query() query: CategoryQueryDto) {
    return this.canteenService.getCategories(query);
  }

  @Get('categories/:id')
  @Public()
  @ApiOperation({ summary: 'Lấy thông tin danh mục theo ID' })
  async getCategoryById(@Param('id') id: string) {
    return this.canteenService.getCategoryById(id);
  }

  @Post('categories')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Tạo danh mục món ăn (ADMIN,MANAGER)' })
  async createCategory(
    @Body() body: CreateCategoryDto,
    @Req() req: any,
  ) {
    return this.canteenService.createCategory(body, req.user);
  }

  @Patch('categories/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Cập nhật danh mục món ăn (ADMIN,MANAGER)' })
  async updateCategory(
    @Param('id') id: string,
    @Body() body: UpdateCategoryDto,
    @Req() req: any,
  ) {
    return this.canteenService.updateCategory(id, body, req.user);
  }

  @Delete('categories/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Xóa danh mục món ăn (ADMIN,MANAGER)' })
  async deleteCategory(@Param('id') id: string, @Req() req: any) {
    return this.canteenService.deleteCategory(id, req.user);
  }
}
