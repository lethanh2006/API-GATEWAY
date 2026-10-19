import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { createJwtKey } from '../config/jwt-secret';
import type {
  GatewayUser,
  RequestWithContext,
} from '../interfaces/request-context.interface';
import { IdentityIntrospectionCache } from './identity-introspection-cache';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-1gio') {
  private readonly authServiceUrl: string;
  private readonly identityCache: IdentityIntrospectionCache<GatewayUser>;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const jwtKey = createJwtKey(configService.get<string>('JWT_SECRET'));
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Kiểu của passport-jwt thiếu KeyObject, nhưng jsonwebtoken vẫn nhận lúc chạy.
      secretOrKeyProvider: (_request, _token, done) =>
        done(null, jwtKey as unknown as Buffer),
      algorithms: ['HS256'],
      passReqToCallback: true,
    });
    this.authServiceUrl = this.configService.get<string>(
      'AUTH_SERVICE_URL',
      'http://localhost:4000',
    );
    const cacheTtlMs = Number(
      this.configService.get<string>(
        'GATEWAY_AUTH_INTROSPECTION_CACHE_TTL_MS',
      ) ?? 0,
    );
    this.identityCache = new IdentityIntrospectionCache(cacheTtlMs);
  }

  async validate(request: RequestWithContext) {
    const authorization = request.headers.authorization;
    const requestId = request.requestContext?.requestId;
    if (!authorization) throw new UnauthorizedException('Thiếu access token');

    const started = performance.now();
    try {
      // Passport đã xác minh chữ ký và hạn của access token này. Chỉ lưu bản băm,
      // và chỉ cache quyết định thành công của Auth trong thời gian ngắn, có giới
      // hạn, để giảm số lần introspect lặp lại khi request dồn dập.
      const cacheKey = createHash('sha256').update(authorization).digest('hex');
      const identity = await this.identityCache.get(cacheKey, async () => {
        const { data } = await this.httpService.axiosRef.post(
          `${this.authServiceUrl}/api/auth/introspect`,
          {},
          {
            headers: {
              Authorization: authorization,
              ...(requestId ? { 'x-request-id': requestId } : {}),
            },
          },
        );
        if (
          !data?.valid ||
          typeof data.user !== 'object' ||
          data.user === null ||
          Array.isArray(data.user)
        ) {
          throw new UnauthorizedException('Token không còn hiệu lực');
        }
        return data.user as GatewayUser;
      });
      return { ...identity };
    } catch {
      throw new UnauthorizedException('Token không còn hiệu lực');
    } finally {
      if (request.requestContext) {
        (request.requestContext.perf ??= {}).authMs =
          performance.now() - started;
      }
    }
  }
}
