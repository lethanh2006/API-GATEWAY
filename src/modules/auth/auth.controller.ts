import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './common/guard/jwt/jwt.guard';
import { RolesGuard } from './common/guard/role/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('api/auth')
@ApiTags('Api Auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ============================================================
  // PUBLIC — không cần JWT
  // ============================================================

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Đăng ký tài khoản mới (PUBLIC)' })
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Đăng nhập bước 1 — verify password, gửi OTP (PUBLIC)' })
  async login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Post('verify')
  @Public()
  @ApiOperation({ summary: 'Đăng nhập bước 2 — xác thực OTP, nhận token (PUBLIC)' })
  async verifyOtp(@Body() body: any) {
    return this.authService.verifyOtp(body);
  }

  @Post('refresh')
  @Public()
  @ApiOperation({ summary: 'Làm mới Access Token (PUBLIC)' })
  async refresh(@Body() body: any) {
    return this.authService.refresh(body);
  }

  @Post('login-google')
  @Public()
  @ApiOperation({ summary: 'Đăng nhập bằng Google (PUBLIC)' })
  async loginWithGoogle(@Body() body: any) {
    return this.authService.loginWithGoogle(body);
  }

  // ============================================================
  // USER — cần JWT
  // ============================================================

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin auth của bản thân (USER)' })
  async getMyProfile(@Req() req: any) {
    return this.authService.getMyProfile(req.user);
  }

  @Patch('me/email')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật email của bản thân (USER)' })
  async updateMyEmail(@Body() body: any, @Req() req: any) {
    return this.authService.updateMyEmail(body, req.user);
  }

  @Delete('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa tài khoản của bản thân (USER)' })
  async deleteMyAccount(@Req() req: any) {
    return this.authService.deleteMyAccount(req.user);
  }

  // ============================================================
  // ADMIN — cần JWT + role ADMIN
  // ============================================================

  @Get('users/:userId')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy thông tin auth của user bất kỳ (ADMIN)' })
  @ApiParam({ name: 'userId', example: '1' })
  async getUserProfileByAdmin(@Param('userId') userId: string, @Req() req: any) {
    return this.authService.getUserProfileByAdmin(userId, req.user);
  }

  @Delete('users/:userId')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Xóa tài khoản của user bất kỳ (ADMIN)' })
  @ApiParam({ name: 'userId', example: '1' })
  async deleteUserByAdmin(@Param('userId') userId: string, @Req() req: any) {
    return this.authService.deleteUserByAdmin(userId, req.user);
  }
}
