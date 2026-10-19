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
import type { UpdateUserDto } from './dto/update-user.dto';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
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
      service: 'user',
      baseUrl: configService.get<string>(
        'USER_SERVICE_URL',
        'http://localhost:5000',
      ),
      label: 'Dịch vụ người dùng',
    });
  }

  getMyProfile(user: GatewayUser) {
    return this.upstream.get('/api/user/me', { user });
  }

  getPublicProfile(userId: string, user: GatewayUser) {
    return this.upstream.get(`/api/user/user/${encodeURIComponent(userId)}`, {
      user,
    });
  }

  getFullProfileByAdmin(userId: string, user: GatewayUser) {
    return this.upstream.get(
      `/api/user/internal/admin/${encodeURIComponent(userId)}`,
      { user },
    );
  }

  getAllUsers(user: GatewayUser) {
    return this.upstream.get('/api/user/user/all', { user });
  }

  updateUser(dto: UpdateUserDto, user: GatewayUser) {
    return this.upstream.post('/api/user/update/user', dto, { user });
  }
}
