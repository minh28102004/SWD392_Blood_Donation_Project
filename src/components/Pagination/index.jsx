import PropTypes from "prop-types";
import { usePagination, DOTS } from "@hooks/usePagination";
import { useState, useEffect } from "react";

const Pagination = ({
  totalCount,
  pageSize,
  onPageChange,
  siblingCount = 1,
  currentPage,
}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Kiểm tra nếu màn hình nhỏ hơn 768px
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Sử dụng hook phân trang
  const paginationRange =
    usePagination({
      totalCount,
      pageSize,
      siblingCount: isSmallScreen ? 0 : siblingCount,
      currentPage,
    }) || []; // Fallback to an empty array if paginationRange is undefined

  // Hàm phân trang cho màn hình nhỏ
  const getSmallScreenPagination = () => {
    const totalPages = Math.ceil(totalCount / pageSize);

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1); // Nếu tổng số trang nhỏ hơn hoặc bằng 5, hiển thị tất cả
    }

    if (currentPage <= 2) {
      return [1, 2, 3, DOTS, totalPages]; // Nếu đang ở trang đầu, hiển thị ba trang đầu và nút "..."
    } else if (currentPage >= totalPages - 1) {
      return [1, DOTS, totalPages - 2, totalPages - 1, totalPages]; // Nếu đang ở trang cuối, hiển thị ba trang cuối và nút "..."
    } else {
      return [1, DOTS, currentPage, DOTS, totalPages]; // Mặc định: hiển thị trang hiện tại và các trang liền kề
    }
  };

  // Chọn dãy số trang hiển thị
  const displayRange = isSmallScreen
    ? getSmallScreenPagination()
    : paginationRange;

  // Trả về null nếu không có trang để hiển thị
  if (!displayRange || displayRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1); // Chuyển sang trang kế tiếp
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1); // Quay lại trang trước
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div className="flex justify-center items-center space-x-2 w-full">
      {/* Nút Previous */}
      <button
        className="px-3 py-1.5 text-sm rounded-md transition-all duration-300 
                   bg-white text-gray-500 font-medium border border-gray-400 
                   hover:bg-gray-50 hover:border-gray-500
                   disabled:opacity-50 transform hover:scale-105 active:scale-95
                   border-solid"
        disabled={currentPage === 1} // Disable nếu đang ở trang đầu
        onClick={onPrevious}
      >
        &lt;
      </button>

      {/* Hiển thị số trang */}
      {displayRange.map((pageNumber, index) => {
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

      {/* Nút Next */}
      <button
        className="px-3 py-1.5 text-sm rounded-md transition-all duration-300 
                   bg-white text-gray-500 font-medium border border-gray-400
                   hover:bg-gray-50 hover:border-gray-500 
                   disabled:opacity-50 transform hover:scale-105 active:scale-95
                   border-solid"
        disabled={currentPage === lastPage} // Disable nếu đang ở trang cuối
        onClick={onNext}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;

Pagination.propTypes = {
  totalCount: PropTypes.number,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func,
  siblingCount: PropTypes.number,
  currentPage: PropTypes.number,
};
