export declare class AuthService {
    static login(slug: string, email: string, passwordPlain: string): Promise<{
        token: string;
        refreshToken: string;
        restaurant: {
            id: string;
            name: string;
            slug: string;
            email: string;
        };
    }>;
    static changePassword(restaurantId: string, currentPasswordPlain: string, newPasswordPlain: string): Promise<{
        message: string;
    }>;
}
export default AuthService;
