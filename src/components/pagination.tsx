import { NextIcon, PreviousLinkIcon } from "@/icons/page";
import { PaginationState } from "@/types/pagination";
import React from "react";

interface PaginationType {
  filter: PaginationState; // Contains page, limit, and other params
  totalItems: number; // Total number of items from the API
  onPageChange: (page: number) => void; // Function to handle page changes
}

const Pagination = ({ filter, totalItems, onPageChange }: PaginationType) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const maxVisiblePages = isMobile ? 2 : 3; // Adjust visible pages for mobile
  const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);
  const currentPage = filter.page || 1; // Current page from filter
  const itemsPerPage = filter.limit || 10; // Items per page from filter
  const totalPages = Math.ceil(totalItems / itemsPerPage); // Total number of pages

  // Calculate start and end pages for pagination display
  const startPage = Math.max(1, currentPage - halfMaxVisiblePages);
  const endPage = Math.min(totalPages, currentPage + halfMaxVisiblePages);

  // Generate an array of pages to display
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Handlers for previous and next buttons
  const handlePreviousClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav className="py-4 flex justify-center bg-white">
      <ul className="flex space-x-2 bg-white">
        {/* Previous Button */}
        <li className="flex items-center">
          <button
            className={`rounded-full px-4 py-1 ${
              currentPage === 1
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-base hover:text-blue-400"
            }`}
            onClick={handlePreviousClick}
            disabled={currentPage === 1}
          >
            <PreviousLinkIcon size={20} />
          </button>
        </li>

        {/* First Page Button */}
        {startPage > 1 && (
          <li>
            <button
              className="rounded-full px-4 py-1 hover:bg-base hover:blue-400"
              onClick={() => onPageChange(1)}
            >
              1
            </button>
          </li>
        )}

        {/* Ellipsis for pages gap */}
        {startPage > 2 && (
          <li>
            <span className="px-4 py-1">...</span>
          </li>
        )}

        {/* Page Buttons */}
        {pages.map((page) => (
          <li key={page}>
            <button
              className={`rounded-full px-3 py-1 ${
                currentPage === page
                  ? "bg-base text-white"
                  : "hover:bg-base hover:text-blue-400"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Ellipsis for pages gap */}
        {endPage < totalPages - 1 && (
          <li>
            <span className="px-3 py-1">...</span>
          </li>
        )}

        {/* Last Page Button */}
        {endPage < totalPages && (
          <li>
            <button
              className="rounded-full px-4 py-1 hover:bg-base hover:text-white"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </li>
        )}

        {/* Next Button */}
        <li className="flex items-center">
          <button
            className={`rounded-full px-3 py-1 ${
              currentPage === totalPages
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-base hover:white"
            }`}
            onClick={handleNextClick}
            disabled={currentPage === totalPages}
          >
            <NextIcon size={20} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
