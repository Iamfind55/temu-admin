import React from "react";
import { NextIcon, PreviousLinkIcon } from "@/icons/page";
import { IProductFilter } from "@/types/filter";

interface PaginationType {
  filter: IProductFilter;
  totalPage: number;
  onPageChange?: (page: number) => void;
}

const ShopProductPagination = ({
  filter,
  totalPage,
  onPageChange,
}: PaginationType) => {
  const currentPage = filter.page || 1;
  const totalPages = totalPage;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const maxVisiblePages = isMobile ? 3 : 5;
  const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

  // Calculate start and end page dynamically
  let startPage = Math.max(1, currentPage - halfMaxVisiblePages);
  let endPage = Math.min(totalPages, currentPage + halfMaxVisiblePages);

  if (currentPage <= halfMaxVisiblePages) {
    endPage = Math.min(maxVisiblePages, totalPages);
  }
  if (currentPage > totalPages - halfMaxVisiblePages) {
    startPage = Math.max(1, totalPages - maxVisiblePages + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handlePreviousClick = () => {
    if (onPageChange && currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (onPageChange && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <>
      {totalPages > 1 && (
        <nav className="mt-4 flex items-center justify-center bg-white">
          <ul className="flex space-x-2 bg-white">
            {/* Previous Button */}
            <li>
              <button
                className={`border rounded p-1 mt-0.5${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
                onClick={handlePreviousClick}
                disabled={currentPage === 1}
              >
                <PreviousLinkIcon size={12} className="text-gray-500" />
              </button>
            </li>

            {/* First Page */}
            {startPage > 1 && (
              <>
                <li>
                  <button
                    className="border rounded text-xs py-0 px-2 text-neon_pink hover:bg-neon_pink hover:text-white"
                    onClick={() => onPageChange && onPageChange(1)}
                  >
                    1
                  </button>
                </li>
                {startPage > 2 && <li className="px-2 text-gray-500">...</li>}
              </>
            )}

            {/* Page Numbers */}
            {pages.map((page) => (
              <li key={page}>
                <button
                  className={`rounded text-xs px-2 ${
                    currentPage === page
                      ? "bg-neon_pink text-white"
                      : "bg-white border text-neon_pink hover:bg-neon_pink hover:text-white"
                  }`}
                  onClick={() => onPageChange && onPageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}

            {/* Last Page */}
            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <li className="px-2 text-gray-500">...</li>
                )}
                <li>
                  <button
                    className="text-xs border rounded py-0 px-2 text-neon_pink hover:bg-neon_pink hover:text-white"
                    onClick={() => onPageChange && onPageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                </li>
              </>
            )}

            {/* Next Button */}
            <li>
              <button
                className={`border rounded p-1 mt-0.5${
                  currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                onClick={handleNextClick}
                disabled={currentPage === totalPages}
              >
                <NextIcon size={12} className="text-gray-500" />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default ShopProductPagination;
