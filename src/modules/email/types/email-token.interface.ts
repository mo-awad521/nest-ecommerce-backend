export interface EmailTokenPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}
