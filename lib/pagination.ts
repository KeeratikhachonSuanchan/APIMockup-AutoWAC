import type { PaginationInput, PaginationOutput } from "./types";

export function paginate<T>(
  items: T[],
  { mode = "page", page = 1, limit = 20, offset = 0 }: PaginationInput = {}
): { data: T[]; pagination: PaginationOutput } {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limit);

  let currentOffset: number;
  let currentPage: number;

  if (mode === "offset") {
    currentOffset = Math.min(Math.max(0, offset), Math.max(0, totalItems - 1));
    currentPage = Math.floor(currentOffset / limit) + 1;
  } else {
    currentPage = Math.min(Math.max(1, page), totalPages || 1);
    currentOffset = (currentPage - 1) * limit;
  }

  const paginatedItems = items.slice(currentOffset, currentOffset + limit);

  return {
    data: paginatedItems,
    pagination: {
      mode,
      page: currentPage,
      limit,
      offset: currentOffset,
      totalItems,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrevious: currentPage > 1,
    },
  };
}
