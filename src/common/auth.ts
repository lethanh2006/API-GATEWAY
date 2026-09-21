import { SetMetadata } from '@nestjs/common';

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CHEF = 'CHEF',
  CASHIER = 'CASHIER',
  WAITER = 'WAITER',
  USER = 'USER',
  VIP = 'VIP',
}

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'role';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
