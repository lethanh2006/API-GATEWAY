import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { RequestWithContext } from '../../../../../common/interfaces/request-context.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-1gio') {
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-super-secret-key-chatapp',
      passReqToCallback: true,
    });
    this.authServiceUrl = this.configService.get<string>(
      'AUTH_SERVICE_URL',
      'http://localhost:4000',
    );
  }

  async validate(request: RequestWithContext, _payload: unknown) {
    const authorization = request.headers.authorization;
    const requestId = request.requestContext?.requestId;
    if (!authorization) throw new UnauthorizedException('Thiếu access token');

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${this.authServiceUrl}/api/auth/introspect`,
          {},
          {
            headers: {
              Authorization: authorization,
              ...(requestId ? { 'x-request-id': requestId } : {}),
            },
          },
        ),
      );
      if (!data?.valid || !data?.user) {
        throw new UnauthorizedException('Token không còn hiệu lực');
      }
      return data.user;
    } catch {
      throw new UnauthorizedException('Token không còn hiệu lực');
    }
  }
}
