import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/common/guard/jwt/jwt.guard';
import { RolesGuard } from '../auth/common/guard/role/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('api/user')
@ApiTags('Api User')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ============================================================
  // USER — xem profile của chính mình (full info)
  // ============================================================
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy full profile của bản thân (USER) — BFF aggregate auth + user',
  })
  async getMyProfile(@Req() req: any) {
    return this.userService.getMyProfile(req.user);
  }

  // ============================================================
  // USER — xem profile public của user khác
  // ============================================================
  @Get(':userId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xem profile public của user khác (USER) — chỉ realname',
  })
  @ApiParam({ name: 'userId', example: '1' })
  async getPublicProfile(@Param('userId') userId: string, @Req() req: any) {
    return this.userService.getPublicProfile(userId, req.user);
  }

  // ============================================================
  // ADMIN — xem full profile của user bất kỳ
  // ============================================================
  @Get('admin/:userId')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Xem full profile của user bất kỳ (ADMIN) — BFF aggregate',
  })
  @ApiParam({ name: 'userId', example: '1' })
  async getFullProfileByAdmin(@Param('userId') userId: string, @Req() req: any) {
    return this.userService.getFullProfileByAdmin(userId, req.user);
  }
}
