import React from 'react';
import { Link, useLocation } from 'react-router';
import type { PaginationData } from '../utils/types';
import { buildPaginationUrl } from '../utils/posts-index';

interface PaginationProps {
  pagination: PaginationData;
}

export function Pagination({ pagination }: PaginationProps) {
  const location = useLocation();
  const basePath = location.pathname;

  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  // Don't show pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return (
    <nav className="pagination" aria-label="Pagination">
      <div className="pagination__info">
        Page {currentPage} of {totalPages}
      </div>

      <div className="pagination__controls">
        {hasPrevPage ? (
          <Link
            to={buildPaginationUrl(basePath, prevPage)}
            className="pagination__button pagination__button--prev"
            aria-label="Previous page"
          >
            ← Previous
          </Link>
        ) : (
          <span className="pagination__button pagination__button--prev pagination__button--disabled">
            ← Previous
          </span>
        )}

        {hasNextPage ? (
          <Link
            to={buildPaginationUrl(basePath, nextPage)}
            className="pagination__button pagination__button--next"
            aria-label="Next page"
          >
            Next →
          </Link>
        ) : (
          <span className="pagination__button pagination__button--next pagination__button--disabled">
            Next →
          </span>
        )}
      </div>
    </nav>
  );
}