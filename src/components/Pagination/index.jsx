import PropTypes from "prop-types";
import { useState, useMemo } from "react";
import { DOTS } from "@hooks/usePagination";

const Pagination = ({
  totalCount,
  pageSize,
  onPageChange,
  siblingCount = 1,
  currentPage,
}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // useMemo to memorize the pagination range based on dependencies
  const paginationRange = useMemo(() => {
    const totalPages = Math.ceil(totalCount / pageSize);
    // If totalPages is small, show all pages
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // If it's a small screen, we hide sibling pages
    if (isSmallScreen) {
      if (currentPage <= 2) {
        return [1, 2, 3, DOTS, totalPages];
      } else if (currentPage >= totalPages - 1) {
        return [1, DOTS, totalPages - 2, totalPages - 1, totalPages];
      } else {
        return [1, DOTS, currentPage, DOTS, totalPages];
      }
    }

    // For larger screens, display sibling pages
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages
    );

    // Build the pagination range
    const range = [];
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      range.push(i);
    }

    // If there are pages to the left of the range, add a left DOTS
    if (leftSiblingIndex > 1) {
      range.unshift(DOTS);
    }

    // If there are pages to the right of the range, add a right DOTS
    if (rightSiblingIndex < totalPages) {
      range.push(DOTS);
    }

    return [1, ...range, totalPages];
  }, [totalCount, pageSize, currentPage, siblingCount, isSmallScreen]);

  const onNext = () => {
    onPageChange(currentPage + 1); // Move to the next page
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1); // Move to the previous page
  };

  // Prevent unnecessary rendering if pagination range is not available
  if (!paginationRange || paginationRange.length < 2) {
    return null;
  }

  return (
    <div className="flex justify-center items-center space-x-2 w-full">
      {/* Previous Button */}
      <button
        className="px-3 py-1.5 text-sm rounded-md transition-all duration-300 
                   bg-white text-gray-500 font-medium border border-gray-400 
                   hover:bg-gray-50 hover:border-gray-500
                   disabled:opacity-50 transform hover:scale-105 active:scale-95
                   border-solid"
        disabled={currentPage === 1} // Disable if on the first page
        onClick={onPrevious}
      >
        &lt;
      </button>

      {/* Page Numbers */}
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <span
              key={`dots-${index}`}
              className="px-3 py-1.5 text-gray-500 font-semibold"
            >
              ...
            </span>
          );
        }

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 
    ${
      currentPage === pageNumber
        ? "bg-blue-500 text-white border-blue-500 shadow-md scale-105"
        : "bg-white text-gray-500 border border-gray-400 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500"
    }
    transform hover:scale-105 active:scale-95`}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        className="px-3 py-1.5 text-sm rounded-md transition-all duration-300 
                   bg-white text-gray-500 font-medium border border-gray-400
                   hover:bg-gray-50 hover:border-gray-500 
                   disabled:opacity-50 transform hover:scale-105 active:scale-95
                   border-solid"
        disabled={currentPage === paginationRange[paginationRange.length - 1]} // Disable if on the last page
        onClick={onNext}
      >
        &gt;
      </button>
    </div>
  );
};

Pagination.propTypes = {
  totalCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  siblingCount: PropTypes.number,
  currentPage: PropTypes.number.isRequired,
};

export default Pagination;
