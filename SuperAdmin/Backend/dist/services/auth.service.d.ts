import { UserRole } from '@prisma/client';
export declare class AuthService {
    static register(data: {
        email: string;
        passwordPlain: string;
        name: string;
        role: UserRole;
        restaurantId?: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        restaurantId: string | null;
    }>;
    static login(email: string, passwordPlain: string): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.UserRole;
            restaurantId: string | null;
        };
    }>;
}
