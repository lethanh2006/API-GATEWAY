import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CanteenService } from './canteen.service';
import { JwtAuthGuard } from '../auth/common/guard/jwt/jwt.guard';
import { RolesGuard } from '../auth/common/guard/role/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '../../common/enums/role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@ApiTags('Api Canteen')
@Controller('api/canteen')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CanteenController {
  constructor(private readonly canteenService: CanteenService) {}

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
}
