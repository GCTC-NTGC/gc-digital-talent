import { useMemo } from "react";

export const DOTS = "…";

const range = (start: number, end: number): number[] => {
  const length = end - start + 1;
  /*
  	Create an array of certain length and set the elements within it from
    start value to end value.
  */
  return Array.from({ length }, (_, idx) => idx + start);
};

type UsePaginationReturn = (number | typeof DOTS)[];

interface UsePaginationArgs {
  /** The current page  */
  currentPage: number;
  /** Total available pages */
  totalPages: number;
  /** Number of elements  on left/right of the current page, defaults to 1 */
  siblings?: number;
  /** Amount of elements visible on left/right edges, defaults to 1  */
  boundaries?: number;
}

type UsePagination = (args: UsePaginationArgs) => UsePaginationReturn;

/**
 * A pagination hook that returns the range of numbers to be displayed in out Pagination component as an array.
 * @see https://www.freecodecamp.org/news/build-a-custom-pagination-component-in-react/
 * @param totalCount
 * @param pageSize
 * @param siblingCount
 * @param currentPage
 * @returns (number | string)[]
 */
export const usePagination: UsePagination = ({
  currentPage,
  totalPages,
  siblings = 1,
  boundaries = 1,
}) => {
  const total = Math.max(Math.trunc(totalPages ?? 0), 0);

  const pageRange = useMemo((): UsePaginationReturn => {
    // Double siblings + boundaries for each side of page numbers
    // 3 represents the page numbers in the middle
    const totalPageNumbers = siblings * 2 + 3 + boundaries * 2;

    if (totalPageNumbers >= total) {
      return range(1, total);
    }

    const leftSiblingIndex = Math.max(currentPage - siblings, boundaries);
    const rightSiblingIndex = Math.min(
      currentPage + siblings,
      total - boundaries,
    );

    const shouldShowLeftDots = leftSiblingIndex > boundaries + 2;
    const shouldShowRightDots = rightSiblingIndex < total - (boundaries + 1);

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = siblings * 2 + boundaries + 2;
      return [
        ...range(1, leftItemCount),
        DOTS,
        ...range(total - (boundaries - 1), total),
      ];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = boundaries + 1 + 2 * siblings;

      return [
        ...range(1, boundaries),
        DOTS,
        ...range(total - rightItemCount, total),
      ];
    }

    return [
      ...range(1, boundaries),
      DOTS,
      ...range(leftSiblingIndex, rightSiblingIndex),
      DOTS,
      ...range(total - boundaries + 1, total),
    ];
  }, [boundaries, currentPage, siblings, total]);

  return pageRange;
};
