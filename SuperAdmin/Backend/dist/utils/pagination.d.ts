export interface PaginationMeta {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
export declare const getPaginationOptions: (pageQuery?: unknown, limitQuery?: unknown) => {
    skip: number;
    take: number;
    page: number;
    limit: number;
};
export declare const getPaginationMeta: (page: number, limit: number, totalCount: number) => PaginationMeta;
