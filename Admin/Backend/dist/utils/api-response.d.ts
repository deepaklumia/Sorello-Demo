import { Response } from 'express';
export interface ApiResponseOptions<T> {
    res: Response;
    statusCode?: number;
    message?: string;
    data?: T;
    meta?: any;
}
export declare const sendResponse: <T>({ res, statusCode, message, data, meta, }: ApiResponseOptions<T>) => Response<any, Record<string, any>>;
export default sendResponse;
