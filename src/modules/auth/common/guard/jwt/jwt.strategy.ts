import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-1gio') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-super-secret-key-chatapp',
    });
  }

  async validate(payload: any) {
    if (payload.user) {
      return payload.user;
    }
    return {
      _id: payload.userId || payload._id || payload.id,
      userId: payload.userId || payload._id || payload.id,
      username: payload.username,
      role: payload.role,
      tokenVersion: payload.tokenVersion,
    };
  }
}
