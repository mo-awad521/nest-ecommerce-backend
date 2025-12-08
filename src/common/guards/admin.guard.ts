import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { JwtPayload } from '../../modules/auth/types/jwt-payload.type';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.get<string[]>(ROLES_KEY, context.getHandler()) ||
      this.reflector.get<string[]>(ROLES_KEY, context.getClass());

    // إذا المسار غير مرتبط بدور معين → السماح
    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as JwtPayload;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    console.log('user', req.user);

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access only');
    }

    return true;
  }
}
