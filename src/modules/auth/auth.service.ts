import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';

import { UpstreamClient } from '../../common/http/upstream-client';
import type {
  GatewayUser,
  RequestWithContext,
} from '../../common/interfaces/request-context.interface';
import { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';
import type { LoginDto } from './dto/login.dto';
import type { RefreshTokenDto } from './dto/refresh-token.dto';
import type { RegisterDto } from './dto/register.dto';
import type { LoginGoogleDto, UpdateEmailDto } from './dto/update-email.dto';
import type { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  private readonly upstream: UpstreamClient;

  constructor(
    httpService: HttpService,
    configService: ConfigService,
    @Inject(REQUEST) request: RequestWithContext,
    signatureService: InternalRequestSignatureService,
  ) {
    this.upstream = new UpstreamClient({
      httpService,
      signatureService,
      request,
      service: 'auth',
      baseUrl: configService.get<string>(
        'AUTH_SERVICE_URL',
        'http://localhost:4000',
      ),
      label: 'Dịch vụ xác thực',
    });
  }

  register(dto: RegisterDto) {
    return this.upstream.post('/api/auth/register', dto);
  }

  login(dto: LoginDto) {
    return this.upstream.post('/api/auth/login', dto);
  }

  verifyOtp(dto: VerifyOtpDto) {
    return this.upstream.post('/api/auth/verify', dto);
  }

  refresh(dto: RefreshTokenDto) {
    return this.upstream.post('/api/auth/refresh', dto);
  }

  loginWithGoogle(dto: LoginGoogleDto) {
    return this.upstream.post('/api/auth/login-google', dto);
  }

  getMyProfile(user: GatewayUser) {
    return this.upstream.get('/api/auth/me', { user });
  }

  updateMyEmail(dto: UpdateEmailDto, user: GatewayUser) {
    return this.upstream.patch('/api/auth/me/email', dto, { user });
  }

  deleteMyAccount(user: GatewayUser) {
    return this.upstream.delete('/api/auth/me', { user });
  }

  getUserProfileByAdmin(userId: string, user: GatewayUser) {
    return this.upstream.get(`/api/auth/users/${encodeURIComponent(userId)}`, {
      user,
    });
  }

  deleteUserByAdmin(userId: string, user: GatewayUser) {
    return this.upstream.delete(
      `/api/auth/users/${encodeURIComponent(userId)}`,
      { user },
    );
  }

  updateUserRole(userId: string, role: string, user: GatewayUser) {
    return this.upstream.patch(
      `/api/auth/users/${encodeURIComponent(userId)}/role`,
      { role },
      { user },
    );
  }
}
