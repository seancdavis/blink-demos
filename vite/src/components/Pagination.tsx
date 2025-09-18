import { Link, useLocation } from 'react-router';
import { useEffect } from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function Pagination({ currentPage, totalPages, hasNextPage, hasPrevPage }: PaginationProps) {
  const location = useLocation();
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  // Generate the base URL for pagination links
  const basePath = location.pathname;
  const prevUrl = `${basePath}?page=${prevPage}`;
  const nextUrl = `${basePath}?page=${nextPage}`;

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
          to={prevUrl}
          className="button pagination-prev"
          rel="prev"
        >
          ← Previous
        </Link>

        <Link
          to={nextUrl}
          className="button pagination-next"
          rel="next"
        >
          Next →
        </Link>
      </div>
    </nav>
  );
}