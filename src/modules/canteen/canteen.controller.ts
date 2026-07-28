import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
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
}
