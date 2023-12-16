export interface JwtPayload {
  id_user: string;
  address: string;
  role: string[];
  iat?: number;
  exp?: number;
}
