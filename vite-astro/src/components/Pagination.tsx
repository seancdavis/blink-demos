import React from 'react'
import { Link } from 'react-router-dom'
import type { PaginationResult } from '@utils/types'

interface PaginationProps {
  pagination: PaginationResult
}

const Pagination: React.FC<PaginationProps> = ({ pagination }) => {
  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination

  const getPrevHref = () => {
    if (currentPage === 2) {
      return '/'
    }
    return `/posts/p/${currentPage - 1}`
  }

  const getNextHref = () => {
    return `/posts/p/${currentPage + 1}`
  }

  return (
    <div className="pagination">
      {hasPrevPage && (
        <Link to={getPrevHref()} className="button pagination-prev">
          ← Previous
        </Link>
      )}

      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>

      {hasNextPage && (
        <Link to={getNextHref()} className="button pagination-next">
          Next →
        </Link>
      )}
    </div>
  )
}

export default Pagination