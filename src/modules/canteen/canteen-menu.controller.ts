import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { AuthenticatedRequest } from '../../common/interfaces/request-context.interface';
import { CanteenService } from './canteen.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

/**
 * Thực đơn căn tin: xem và tìm món công khai, ADMIN quản lý món và hoàn tác; chuyển tiếp tới
 * Canteen.
 */
@ApiTags('Api Canteen')
@Controller('api/canteen')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CanteenMenuController {
  constructor(private readonly canteenService: CanteenService) {}

  @Get('menu')
  @Public()
  @ApiOperation({
    summary: 'Lấy thực đơn đang bán, phân nhóm theo danh mục đang hoạt động',
  })
  getMenu() {
    return this.canteenService.getMenu();
  }

  @Get('menu/search')
  @Public()
  @ApiOperation({
    summary: 'Tìm kiếm món ăn đang bán theo tên',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description:
      'Chuỗi con trong tên món; không phân biệt hoa thường; bỏ trống để lấy toàn bộ món đang bán',
    example: 'cơm tấm',
  })
  searchMenu(@Query('q') query: string) {
    return this.canteenService.searchMenu(query || '');
  }

  @Get('admin/menu')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Lấy toàn bộ món và danh mục, kể cả dữ liệu đang ẩn',
  })
  getAdminMenu(@Req() req: AuthenticatedRequest) {
    return this.canteenService.getAdminMenu(req.user);
  }

  @Post('admin/menu')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Tạo mới món ăn (ADMIN)' })
  createMenuItem(
    @Body() body: CreateMenuItemDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.canteenService.createMenuItem(body, req.user);
  }

  @Put('admin/menu/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật thông tin món ăn (ADMIN)' })
  updateMenuItem(
    @Param('id') id: string,
    @Body() body: UpdateMenuItemDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.canteenService.updateMenuItem(id, body, req.user);
  }

  @Delete('admin/menu/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Xóa món ăn và lưu dữ liệu vào lịch sử hoàn tác (ADMIN)',
  })
  deleteMenuItem(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.canteenService.deleteMenuItem(id, req.user);
  }

  @Post('admin/menu/undo')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Hoàn tác (Undo) thao tác sửa đổi vừa thực hiện trên Menu (ADMIN)',
  })
  undoMenuItemChange(@Req() req: AuthenticatedRequest) {
    return this.canteenService.undoMenuItemChange(req.user);
  }

  @Post('admin/menu/redo')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Làm lại (Redo) thao tác vừa hoàn tác trên Menu (ADMIN)',
  })
  redoMenuItemChange(@Req() req: AuthenticatedRequest) {
    return this.canteenService.redoMenuItemChange(req.user);
  }
}
