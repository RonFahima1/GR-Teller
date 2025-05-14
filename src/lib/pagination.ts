export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function getPaginationParams(params: PaginationParams = {}): {
  skip: number;
  take: number;
  orderBy: { [key: string]: 'asc' | 'desc' };
} {
  const page = params.page || DEFAULT_PAGINATION.page;
  const pageSize = params.pageSize || DEFAULT_PAGINATION.pageSize;
  const sortBy = params.sortBy || DEFAULT_PAGINATION.sortBy;
  const sortOrder = params.sortOrder || DEFAULT_PAGINATION.sortOrder;

  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      [sortBy]: sortOrder,
    },
  };
}

export function getPaginationMeta(
  total: number,
  params: PaginationParams = {}
): {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasPrevious: boolean;
  hasNext: boolean;
} {
  const page = params.page || DEFAULT_PAGINATION.page;
  const pageSize = params.pageSize || DEFAULT_PAGINATION.pageSize;

  const totalPages = Math.ceil(total / pageSize);
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    hasPrevious,
    hasNext,
  };
}
