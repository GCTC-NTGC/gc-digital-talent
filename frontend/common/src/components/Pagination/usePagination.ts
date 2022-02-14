import { useMemo, useState } from "react";

export const DOTS = "...";

const range = (start: number, end: number): number[] => {
  const length = end - start + 1;
  /*
  	Create an array of certain length and set the elements within it from
    start value to end value.
  */
  return Array.from({ length }, (_, idx) => idx + start);
};

/**
 * A pagination hook that returns the range of numbers to be displayed in out Pagination component as an array.
 * @see https://www.freecodecamp.org/news/build-a-custom-pagination-component-in-react/
 * @param totalCount
 * @param pageSize
 * @param siblingCount
 * @param currentPage
 * @returns (number | string)[]
 */
export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}: {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
}): (number | string)[] => {
  const paginationRange: (number | string)[] | undefined = useMemo(() => {
    if (totalCount < 0 || pageSize < 0 || siblingCount < 0 || currentPage < 0) {
      throw new Error(
        "Ensure all usePagination parameters are non-negative numbers",
      );
    }

    const totalPageCount = Math.ceil(totalCount / pageSize);

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    /*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    /*
    	Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    */
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount,
    );

    /*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    /*
    	Case 2: No left dots to show, but rights dots to be shown
    */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    /*
    	Case 3: No right dots to show, but left dots to be shown
    */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount,
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    /*
    	Case 4: Both left and right dots to be shown
    */
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    // If none of the above cases are hit then throw an Error
    throw new Error("usePagination hook failed.");
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange || range(1, Math.ceil(totalCount / pageSize));
};

/**
 * A pagination hook that returns a list of variables needed for the pagination component.
 * @param page current page
 * @param pageSize total number of items per page
 * @param data array of data
 * @returns { currentPage, currentTableData, setCurrentPage }
 */
export function usePaginationVars<T>(
  page: number,
  pageSize: number,
  data: T[],
) {
  const [currentPage, setCurrentPage] = useState(page);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return data.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, data, pageSize]);

  return { currentPage, currentTableData, setCurrentPage };
}
