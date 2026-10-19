import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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

import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { AuthenticatedRequest } from '../../common/interfaces/request-context.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginGoogleDto, UpdateEmailDto } from './dto/update-email.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

/**
 * Đăng ký, đăng nhập (mật khẩu rồi OTP, hoặc Google), làm mới token và quản lý tài khoản; chuyển
 * tiếp tới Auth. Các route đăng nhập là công khai, `users/*` chỉ ADMIN.
 */
@Controller('api/auth')
@ApiTags('Api Auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Đăng ký tài khoản mới (PUBLIC)' })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập bước 1 — verify password, gửi OTP (PUBLIC)',
  })
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('verify')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập bước 2 — xác thực OTP, nhận token (PUBLIC)',
  })
  verifyOtp(@Body() body: VerifyOtpDto) {
    return this.authService.verifyOtp(body);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Làm mới Access Token (PUBLIC)' })
  refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body);
  }

  @Post('login-google')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập bằng Google (PUBLIC)' })
  loginWithGoogle(@Body() body: LoginGoogleDto) {
    return this.authService.loginWithGoogle(body);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin auth của bản thân (USER)' })
  getMyProfile(@Req() req: AuthenticatedRequest) {
    return this.authService.getMyProfile(req.user);
  }

  @Patch('me/email')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật email của bản thân (USER)' })
  updateMyEmail(
    @Body() body: UpdateEmailDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.authService.updateMyEmail(body, req.user);
  }

  @Delete('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa tài khoản của bản thân (USER)' })
  deleteMyAccount(@Req() req: AuthenticatedRequest) {
    return this.authService.deleteMyAccount(req.user);
  }

  @Get('users/:userId')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy thông tin auth của user bất kỳ (ADMIN)' })
  @ApiParam({ name: 'userId', example: '1' })
  getUserProfileByAdmin(
    @Param('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.authService.getUserProfileByAdmin(userId, req.user);
  }

  @Delete('users/:userId')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Xóa tài khoản của user bất kỳ (ADMIN)' })
  @ApiParam({ name: 'userId', example: '1' })
  deleteUserByAdmin(
    @Param('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.authService.deleteUserByAdmin(userId, req.user);
  }

  @Patch('users/:userId/role')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật vai trò người dùng (ADMIN)' })
  @ApiParam({ name: 'userId', example: '1' })
  updateUserRole(
    @Param('userId') userId: string,
    @Body() body: { role: string },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.authService.updateUserRole(userId, body.role, req.user);
  }
}
