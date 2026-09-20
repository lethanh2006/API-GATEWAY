import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { RequestWithContext } from '../../../../../common/interfaces/request-context.interface';
import { createJwtKey } from '../../../../../common/config/jwt-secret';
import { performance } from 'node:perf_hooks';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-1gio') {
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const jwtKey = createJwtKey(configService.get<string>('JWT_SECRET'));
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // passport-jwt types omit KeyObject, which jsonwebtoken accepts at runtime.
      secretOrKeyProvider: (_request, _token, done) =>
        done(null, jwtKey as unknown as Buffer),
      algorithms: ['HS256'],
      passReqToCallback: true,
    });
    this.authServiceUrl = this.configService.get<string>(
      'AUTH_SERVICE_URL',
      'http://localhost:4000',
    );
  }

  async validate(request: RequestWithContext) {
    const authorization = request.headers.authorization;
    const requestId = request.requestContext?.requestId;
    if (!authorization) throw new UnauthorizedException('Thiếu access token');

    const started = performance.now();
    try {
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
      if (!data?.valid || !data?.user) {
        throw new UnauthorizedException('Token không còn hiệu lực');
      }
      return data.user;
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
