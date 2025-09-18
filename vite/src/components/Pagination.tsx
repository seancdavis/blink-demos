import { Link } from 'react-router';
import { useEffect } from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function Pagination({ currentPage, totalPages, hasNextPage, hasPrevPage }: PaginationProps) {
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  useEffect(() => {
    // Hide pagination buttons when not needed (equivalent to the script in your template)
    const prevBtn = document.querySelector('.pagination-prev') as HTMLElement;
    const nextBtn = document.querySelector('.pagination-next') as HTMLElement;

    if (prevBtn && !hasPrevPage) {
      prevBtn.style.display = 'none';
    } else if (prevBtn) {
      prevBtn.style.display = '';
    }

    if (nextBtn && !hasNextPage) {
      nextBtn.style.display = 'none';
    } else if (nextBtn) {
      nextBtn.style.display = '';
    }
  }, [hasNextPage, hasPrevPage]);

  return (
    <nav className="pagination container-xs">
      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>

      <div className="pagination-controls">
        <Link
          to={`/?page=${prevPage}`}
          className="button pagination-prev"
          rel="prev"
        >
          ← Previous
        </Link>

        <Link
          to={`/?page=${nextPage}`}
          className="button pagination-next"
          rel="next"
        >
          Next →
        </Link>
      </div>
    </nav>
  );
}