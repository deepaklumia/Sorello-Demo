export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const getPaginationOptions = (
  pageQuery?: unknown,
  limitQuery?: unknown
) => {
  const pageStr = typeof pageQuery === 'string' ? pageQuery : '1';
  const limitStr = typeof limitQuery === 'string' ? limitQuery : '10';

  const page = Math.max(1, parseInt(pageStr, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(limitStr, 10) || 10));
  
  const skip = (page - 1) * limit;
  const take = limit;

  return { skip, take, page, limit };
};

export const getPaginationMeta = (
  page: number,
  limit: number,
  totalCount: number
): PaginationMeta => {
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
