import { JwtPayload } from 'src/modules/auth/types/jwt-payload.type';

declare global {
  namespace Express {
    interface User extends JwtPayload {
      sub: number;
      email: string;
    }
  }
}
