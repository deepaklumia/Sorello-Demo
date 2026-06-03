export declare class ApiError extends Error {
    readonly statusCode: number;
    readonly errors?: any;
    constructor(statusCode: number, message: string, errors?: any);
    static badRequest(message: string, errors?: any): ApiError;
    static unauthorized(message?: string): ApiError;
    static forbidden(message?: string): ApiError;
    static notFound(message?: string): ApiError;
    static internal(message?: string): ApiError;
}
