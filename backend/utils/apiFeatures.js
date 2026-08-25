// Small helper to compute pagination metadata consistently across list endpoints.
export const paginate = (totalCount, page, limit) => {
  const totalPages = Math.ceil(totalCount / limit) || 1;
  return {
    total: totalCount,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
