/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, renderHook } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderWithProviders } from "@gc-digital-talent/jest-helpers";

import Pagination, { PaginationProps } from "./Pagination";
import { DOTS, usePagination } from "./usePagination";

const onCurrentPageChange = jest.fn();
const onPageSizeChange = jest.fn();

const defaultProps: PaginationProps = {
  currentPage: 1,
  totalCount: 100,
  totalPages: 10,
  pageSize: 10,
  color: "black",
  ariaLabel: "Pagination",
  onCurrentPageChange,
  onPageSizeChange,
};

const renderPagination = (props: Partial<PaginationProps>) =>
  renderWithProviders(<Pagination {...defaultProps} {...props} />);

/**
 * Get expected page count
 *
 * Adds 4 to the expected page count
 * representing first, last, next and previous buttons.
 *
 * @param initialPageCount
 * @returns number
 */
const getExpectedPageCount = (initialPageCount: number): number => {
  return initialPageCount + 4;
};

/**
 * Get DOTS
 *
 * Retrieves all list items with DOTS
 */
const assertDotCount = (count: number) => {
  const dots = screen
    .queryAllByRole("listitem")
    .filter((item) => item.textContent === "…");

  expect(dots).toHaveLength(count);
};

describe("Pagination tests", () => {
  const user = userEvent.setup();

  it("If the total page count is less then page chips show range from 1 to totalPageCount", async () => {
    const props: PaginationProps = {
      ...defaultProps,
      totalCount: 50,
      totalPages: 5,
    };
    renderPagination(props);
    const { result } = renderHook(() => usePagination(props)); // should return an ordered array of the pagination pages.
    const paginationRange = [1, 2, 3, 4, 5];
    expect(result.current).toStrictEqual(paginationRange); // test if paginationRange matches the result from hook.

    const pages = screen.getAllByRole("listitem");

    expect(pages).toHaveLength(getExpectedPageCount(paginationRange.length));
    assertDotCount(0);

    expect(screen.getByRole("button", { name: /1/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /2/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /3/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /4/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /5/ })).toBeInTheDocument();
  });

  it("Should show DOTS on right side when total page count is greater then page chips", () => {
    renderPagination({});
    const { result } = renderHook(() => usePagination(defaultProps)); // should return an ordered array of the pagination pages (including the DOTS).
    const paginationRange = [1, 2, 3, 4, 5, DOTS, 10];
    expect(result.current).toStrictEqual(paginationRange); // test if page range matches result from hook.

    expect(screen.getAllByRole("listitem")).toHaveLength(
      getExpectedPageCount(paginationRange.length),
    );
    assertDotCount(1);
  });

  it("Should show DOTS on left side when total page count is greater then page chips", () => {
    const props = { ...defaultProps, currentPage: 9 };
    renderPagination(props);
    const { result } = renderHook(() => usePagination(props)); // should return an ordered array of the pagination pages (including the DOTS).
    const paginationRange = [1, DOTS, 6, 7, 8, 9, 10]; // test if page range matches result from hook.

    expect(result.current).toStrictEqual(paginationRange);

    expect(screen.getAllByRole("listitem")).toHaveLength(
      getExpectedPageCount(paginationRange.length),
    );

    assertDotCount(1);
  });

  it("Should show DOTS on left and right side when total page count is greater then page chips", () => {
    const props = {
      ...defaultProps,
      currentPage: 5,
    };
    renderPagination(props);
    const { result } = renderHook(() => usePagination(props)); // should return an ordered array of the pagination pages (including the DOTS).
    const paginationRange = [1, DOTS, 4, 5, 6, DOTS, 10]; // test if page range matches result from hook.

    expect(result.current).toStrictEqual(paginationRange);

    expect(screen.getAllByRole("listitem")).toHaveLength(
      getExpectedPageCount(paginationRange.length),
    );

    assertDotCount(2);
  });

  it("Should handle clicks on right (next) arrow buttons correctly", async () => {
    const handlePageChange = jest.fn();
    const props = { ...defaultProps, onCurrentPageChange: handlePageChange };
    renderPagination(props);

    expect(screen.getByRole("button", { name: /prev/i })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(handlePageChange).toHaveBeenCalledWith(props.currentPage + 1);
  });

  it("Should handle clicks on left (previous) arrow buttons correctly", async () => {
    const handlePageChange = jest.fn();
    const lastPage = 5;
    const props = {
      ...defaultProps,
      totalPages: 5,
      totalCount: 50,
      onCurrentPageChange: handlePageChange,
      currentPage: lastPage,
    };
    renderPagination(props);

    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /prev/i }));

    expect(handlePageChange).toHaveBeenCalledWith(props.currentPage - 1);
  });

  it("Should handle clicks on page buttons correctly", async () => {
    const handlePageChange = jest.fn();
    const props = {
      ...defaultProps,
      totalPages: 5,
      totalCount: 50,
      onCurrentPageChange: handlePageChange,
    };
    renderPagination(props);

    await user.click(screen.getByRole("button", { name: /page 3/i }));
    expect(handlePageChange).toHaveBeenCalledWith(3);

    await user.click(screen.getByRole("button", { name: /page 5/i }));
    expect(handlePageChange).toHaveBeenCalledWith(5);

    await user.click(screen.getByRole("button", { name: /page 2/i }));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });
});
