import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { AuthenticatedRequest } from '../../common/interfaces/request-context.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

/**
 * Hồ sơ người dùng: `me` và `admin/:userId` gộp dữ liệu Auth với User, các route còn lại chuyển
 * tiếp tới User.
 */
@Controller('api/user')
@ApiTags('Api User')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy full profile của bản thân (USER) — BFF aggregate auth + user',
  })
  getMyProfile(@Req() req: AuthenticatedRequest) {
    return this.userService.getMyProfile(req.user);
  }

  @Get('user/all')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách tất cả người dùng trong hệ thống (USER)',
  })
  getAllUsers(@Req() req: AuthenticatedRequest) {
    return this.userService.getAllUsers(req.user);
  }

  @Get(':userId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xem profile public của user khác (USER) — chỉ realname',
  })
  @ApiParam({ name: 'userId', example: '1' })
  getPublicProfile(
    @Param('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.userService.getPublicProfile(userId, req.user);
  }

  @Post('update/user')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật tên hiển thị của người dùng (USER)',
  })
  updateUser(@Body() body: UpdateUserDto, @Req() req: AuthenticatedRequest) {
    return this.userService.updateUser(body, req.user);
  }

  @Get('admin/:userId')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Xem full profile của user bất kỳ (ADMIN) — BFF aggregate',
  })
  @ApiParam({ name: 'userId', example: '1' })
  getFullProfileByAdmin(
    @Param('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.userService.getFullProfileByAdmin(userId, req.user);
  }
}
