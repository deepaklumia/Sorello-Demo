import { UserRole } from '@prisma/client';
export declare class AuthService {
    static register(data: {
        email: string;
        password: string;
        name: string;
        role: UserRole;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    static login(email: string, passwordPlain: string): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
}
