import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import type { GatewayUser } from '../interfaces/request-context.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Route không khai báo @Roles thì mọi người đã xác thực đều được vào.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: GatewayUser }>();

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Bạn chưa đăng nhập',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const hasRole = requiredRoles.some(
      (role) =>
        user.role?.toString().toUpperCase() === role.toString().toUpperCase(),
    );

    if (!hasRole) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `Bạn không có quyền. Yêu cầu: ${requiredRoles.join(', ')}`,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
