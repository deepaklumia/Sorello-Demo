export interface JwtPayload {
    id: string;
    email: string;
    slug: string;
}
export declare class JwtUtils {
    static generateAccessToken(payload: JwtPayload): string;
    static generateRefreshToken(payload: JwtPayload): string;
    static verifyToken(token: string): JwtPayload;
}
export default JwtUtils;
