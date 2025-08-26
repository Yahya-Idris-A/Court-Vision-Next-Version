import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

const pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers: (number | string)[] = [];

  const createPageRange = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  if (totalPages <= 5) {
    pageNumbers.push(...createPageRange(1, totalPages));
  } else {
    if (currentPage < 3) {
      pageNumbers.push(...createPageRange(1, 2), "...", totalPages);
    } else if (currentPage >= totalPages - 1) {
      pageNumbers.push(
        1,
        "...",
        ...createPageRange(totalPages - 1, totalPages)
      );
    } else {
      pageNumbers.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
  }
  return (
    <div className="flex flex-wrap justify-center gap-[0.5rem] max-sm:gap-[4px] items-center mb-[20px]">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-[var(--MainText)] bg-gray-200 rounded-[6px] px-[10px] py-[8px] cursor-pointer"
      >
        <ArrowLeft className="max-sm:h-[16px] max-sm:w-[16px]" />
      </button>

      {pageNumbers.map((num, idx) =>
        typeof num === "number" ? (
          <button
            key={idx}
            onClick={() => onPageChange(num)}
            disabled={num === currentPage}
            style={{
              background: num === currentPage ? "#007aff" : "#e5e7eb",
            }}
            className="w-[45px] max-sm:w-[35px] py-[8px] max-sm:py-[4px] text-[var(--MainText)] cursor-pointer rounded-[6px] transition-all duration-300"
          >
            {num}
          </button>
        ) : (
          <span
            className="w-[45px] max-sm:w-[35px] py-[8px] max-sm:py-[4px] text-[var(--MainText)] rounded-[6px] transition-all duration-300 bg-[#e5e7eb] text-center"
            key={idx}
          >
            ...
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-[var(--MainText)] bg-gray-200 rounded-[6px] px-[10px] py-[8px] cursor-pointer"
      >
        <ArrowRight className="max-sm:h-[16px] max-sm:w-[16px]" />
      </button>
    </div>
  );
};

export default pagination;
