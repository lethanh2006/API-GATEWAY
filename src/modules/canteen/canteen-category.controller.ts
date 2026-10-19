import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { AuthenticatedRequest } from '../../common/interfaces/request-context.interface';
import { CanteenService } from './canteen.service';
import { CategoryQueryDto } from './dto/category-query.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

/** Danh mục món của căn tin: xem công khai, ADMIN quản lý; chuyển tiếp tới Canteen. */
@ApiTags('Api Canteen')
@Controller('api/canteen')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CanteenCategoryController {
  constructor(private readonly canteenService: CanteenService) {}

  @Get('categories')
  @Public()
  @ApiOperation({
    summary: 'Lấy danh sách danh mục có tìm kiếm, sắp xếp và phân trang',
  })
  getCategories(@Query() query: CategoryQueryDto) {
    return this.canteenService.getCategories(query);
  }

  @Get('categories/:id')
  @Public()
  @ApiOperation({ summary: 'Lấy thông tin danh mục theo ID' })
  getCategoryById(@Param('id') id: string) {
    return this.canteenService.getCategoryById(id);
  }

  @Post('categories')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Tạo danh mục món ăn (ADMIN)' })
  createCategory(
    @Body() body: CreateCategoryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.canteenService.createCategory(body, req.user);
  }

  @Patch('categories/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật danh mục món ăn (ADMIN)' })
  updateCategory(
    @Param('id') id: string,
    @Body() body: UpdateCategoryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.canteenService.updateCategory(id, body, req.user);
  }

  @Delete('categories/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Xóa danh mục chưa có món ăn liên quan (ADMIN)',
  })
  deleteCategory(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.canteenService.deleteCategory(id, req.user);
  }
}
