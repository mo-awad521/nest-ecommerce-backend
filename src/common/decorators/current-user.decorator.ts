import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../../modules/auth/types/jwt-payload.type';

// export interface CurrentUserData {
//   sub: number;
//   email: string;
//   refreshToken?: string; // في حالة refresh فقط
// }

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<Request>();

    // Passport always attaches the decoded JWT + extra fields to request.user
    const user = request.user as JwtPayload | undefined;

    if (!user) {
      throw new Error('Invalid authentication payload: missing user');
    }

    return user;
  },
);

// export const CurrentUser = createParamDecorator(
//   (_data: unknown, ctx: ExecutionContext): JwtPayload => {
//     const request = ctx.switchToHttp().getRequest<{ user?: JwtPayload }>();
//     const user = request.user;

//     if (!user) {
//       throw new Error('Invalid authentication payload: missing user');
//     }

//     return user;
//   },

// );
