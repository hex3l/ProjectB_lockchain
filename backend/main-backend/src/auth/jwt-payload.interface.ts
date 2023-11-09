export interface JwtPayload {
    username: string;
    email: string;
    password: string;
    role: string;
    iat?: number;
    exp?: number;
}
