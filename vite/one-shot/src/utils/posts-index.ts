import type { Post, PostWithUser, PaginationData } from './types';

export function paginatePosts(
  posts: PostWithUser[],
  page: number,
  perPage: number = 12
): { paginatedPosts: PostWithUser[]; pagination: PaginationData } {
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  const pagination: PaginationData = {
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    totalPosts,
  };

  return { paginatedPosts, pagination };
}

export function getPageFromSearchParams(searchParams: URLSearchParams): number {
  const pageParam = searchParams.get('page');
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  return isNaN(page) || page < 1 ? 1 : page;
}

export function buildPaginationUrl(basePath: string, page: number): string {
  if (page <= 1) {
    return basePath;
  }
  return `${basePath}?page=${page}`;
}