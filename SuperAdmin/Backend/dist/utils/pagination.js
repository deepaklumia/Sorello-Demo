"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationMeta = exports.getPaginationOptions = void 0;
const getPaginationOptions = (pageQuery, limitQuery) => {
    const pageStr = typeof pageQuery === 'string' ? pageQuery : '1';
    const limitStr = typeof limitQuery === 'string' ? limitQuery : '10';
    const page = Math.max(1, parseInt(pageStr, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(limitStr, 10) || 10));
    const skip = (page - 1) * limit;
    const take = limit;
    return { skip, take, page, limit };
};
exports.getPaginationOptions = getPaginationOptions;
const getPaginationMeta = (page, limit, totalCount) => {
    const totalPages = Math.ceil(totalCount / limit);
    return {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
};
exports.getPaginationMeta = getPaginationMeta;
