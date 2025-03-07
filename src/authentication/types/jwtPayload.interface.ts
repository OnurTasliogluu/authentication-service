export interface JWTPayload {
  tenantId: string;
  role: string;
  sub: string;
  email: string;
}
