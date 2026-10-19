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

import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { AuthenticatedRequest } from '../../common/interfaces/request-context.interface';
import { CanteenService } from './canteen.service';
import { CreateTableDto } from './dto/create-table.dto';
import { TableQueryDto } from './dto/table-query.dto';
import { UpdateTableStatusDto } from './dto/update-table-status.dto';
import { UpdateTableDto } from './dto/update-table.dto';

/** Bàn ăn của căn tin; chuyển tiếp tới Canteen. */
@ApiTags('Api Canteen')
@Controller('api/canteen')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CanteenTableController {
  constructor(private readonly canteenService: CanteenService) {}

  @Get('tables')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách bàn ăn có tìm kiếm, sắp xếp và phân trang',
  })
  getAllTables(
    @Query() query: TableQueryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.canteenService.getAllTables(query, req.user);
  }

  @Get('tables/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin bàn ăn theo ID' })
  getTableById(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.canteenService.getTableById(id, req.user);
  }

  @Post('tables')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Khởi tạo bàn ăn mới (ADMIN)' })
  createTable(@Body() body: CreateTableDto, @Req() req: AuthenticatedRequest) {
    return this.canteenService.createTable(body, req.user);
  }

  @Patch('tables/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật thông tin bàn ăn (ADMIN)' })
  updateTable(
    @Param('id') id: string,
    @Body() body: UpdateTableDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.canteenService.updateTable(id, body, req.user);
  }

  @Delete('tables/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Xóa bàn ăn đang trống (ADMIN)' })
  deleteTable(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.canteenService.deleteTable(id, req.user);
  }

  @Patch('tables/:id/status')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Cập nhật trạng thái bàn ăn (empty, occupied, reserved) (ADMIN)',
  })
  updateTableStatus(
    @Param('id') id: string,
    @Body() body: UpdateTableStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.canteenService.updateTableStatus(id, body, req.user);
  }
}
