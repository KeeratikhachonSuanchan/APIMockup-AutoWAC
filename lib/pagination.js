function paginate(items, page = 1, limit = 10) {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  const offset = (currentPage - 1) * limit;
  const paginatedItems = items.slice(offset, offset + limit);

  return {
    data: paginatedItems,
    pagination: {
      Offset: offset,
      Limit: limit,
      Page: currentPage,
      TotalItems: totalItems,
      TotalPages: totalPages,
      HasNext: currentPage < totalPages,
      HasPrevious: currentPage > 1,
    },
  };
}

module.exports = { paginate };
