import { Request } from 'express';

export interface RefreshRequest extends Request {
  refreshToken: string;
}
