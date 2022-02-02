/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import React from "react";
import Pagination from "./Pagination";
import { DOTS, usePagination } from "./usePagination";
import IntlContainer from "../../../../talentsearch/resources/js/components/IntlContainer";

function renderPagination(
  currentPage: number,
  pageSize: number,
  siblingCount: number,
  totalCount: number,
  handlePageChange: (pageNumber: number) => void,
) {
  return render(
    <IntlContainer locale="en">
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        siblingCount={siblingCount}
        totalCount={totalCount}
        handlePageChange={handlePageChange}
      />
    </IntlContainer>,
  );
}

describe("Pagination tests", () => {
  test("If the total page count is less then page pills show range from 1 to totalPageCount", () => {
    const props = { currentPage: 1, pageSize: 2, siblingCount: 1, totalCount: 10 };
    const { currentPage, pageSize, siblingCount, totalCount } = props;
    renderPagination(currentPage, pageSize, siblingCount, totalCount, jest.fn());
    const { result } = renderHook(() => usePagination(props)); // should return an ordered array of the pagination pages (including the DOTS).
    const paginationRange = [1, 2, 3, 4, 5];
    expect(result.current).toStrictEqual(paginationRange); // test if page range matches result from hook.

    const pages = screen.getAllByTestId("pagination");
    const dots = screen.queryAllByTestId("dots");
    expect(pages).toHaveLength(5);
    expect(dots).toHaveLength(0);
    pages.forEach((page, index) => {
      const text = page.textContent;
      expect(text).toBe(String(index + 1)); // the text should be in the same order as the index + 1
    });
  });

  test("Should show DOTS on right side when total page count is greater then page pills", () => {
    const props = { currentPage: 1, pageSize: 3, siblingCount: 1, totalCount: 20 };
    const { currentPage, pageSize, siblingCount, totalCount } = props;
    renderPagination(currentPage, pageSize, siblingCount, totalCount, jest.fn());
    const { result } = renderHook(() => usePagination(props)); // should return an ordered array of the pagination pages (including the DOTS).
    const paginationRange = [1, 2, 3, 4, 5, DOTS, 7];
    expect(result.current).toStrictEqual(paginationRange); // test if page range matches result from hook.

    const pages = screen.getAllByTestId("pagination");
    const dots = screen.getAllByTestId("dots");
    expect(pages).toHaveLength(6);
    expect(dots).toHaveLength(1);
  });

  test("Should show DOTS on left side when total page count is greater then page pills", () => {
    const props = { currentPage: 6, pageSize: 3, siblingCount: 1, totalCount: 20 };
    const { currentPage, pageSize, siblingCount, totalCount } = props;
    renderPagination(currentPage, pageSize, siblingCount, totalCount, jest.fn());
    const { result } = renderHook(() => usePagination(props)); // should return an ordered array of the pagination pages (including the DOTS).
    const paginationRange = [1, DOTS, 3, 4, 5, 6, 7];// test if page range matches result from hook.
    expect(result.current).toStrictEqual(paginationRange);
    const pages = screen.getAllByTestId("pagination");
    const dots = screen.getAllByTestId("dots");
    expect(pages).toHaveLength(6);
    expect(dots).toHaveLength(1);
  });

  test("Should show DOTS on left and right side when total page count is greater then page pills", () => {
    const props = { currentPage: 5, pageSize: 3, siblingCount: 1, totalCount: 30 };
    const { currentPage, pageSize, siblingCount, totalCount } = props;
    renderPagination(currentPage, pageSize, siblingCount, totalCount, jest.fn());
    const { result } = renderHook(() => usePagination(props)); // should return an ordered array of the pagination pages (including the DOTS).
    const paginationRange = [1, DOTS, 4, 5, 6, DOTS, 10]; // test if page range matches result from hook.
    expect(result.current).toStrictEqual(paginationRange);
    const pages = screen.getAllByTestId("pagination");
    const dots = screen.getAllByTestId("dots");
    expect(pages).toHaveLength(5);
    expect(dots).toHaveLength(2);
  });
});
