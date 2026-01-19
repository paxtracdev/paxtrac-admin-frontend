import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import React from "react";

const ItemPagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      {/* Previous Button */}
      <button
        className="pagination-icon-btn"
        disabled={page === 1}
        onClick={() => onPageChange(1)}
      >
        <ChevronsLeft size={20} />
      </button>

      {/* Previous Page */}
      <button
        className="pagination-icon-btn"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Page Info */}
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>

      {/* Next Page */}
      <button
        className="pagination-icon-btn"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight size={20} />
      </button>

      {/* Last Page */}
      <button
        className="pagination-icon-btn"
        disabled={page === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        <ChevronsRight size={20} />
      </button>
    </div>
  );
};

export default ItemPagination;
