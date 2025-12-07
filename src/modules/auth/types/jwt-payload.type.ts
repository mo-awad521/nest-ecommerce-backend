export interface JwtPayload {
  sub: number;
  email: string;
  role?: string;
  refreshToken?: string;
}
