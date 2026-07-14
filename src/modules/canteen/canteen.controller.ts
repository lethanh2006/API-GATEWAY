import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { CanteenService } from './canteen.service';
import { JwtAuthGuard } from '../auth/common/guard/jwt/jwt.guard';
import { RolesGuard } from '../auth/common/guard/role/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '../../common/enums/role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';

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
}
