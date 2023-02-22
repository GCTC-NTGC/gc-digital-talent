/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, render, screen, renderHook } from "@testing-library/react";
import React from "react";
import { IntlProvider, MessageFormatElement } from "react-intl";

import { PaginationProps } from "./Pagination";
import { BothDots, LeftDots, NoDots, RightDots } from "./Pagination.stories";
import { DOTS, usePagination } from "./usePagination";

const renderWithReactIntl = (
  component: React.ReactNode,
  locale?: "en" | "fr",
  messages?: Record<string, string> | Record<string, MessageFormatElement[]>,
) => {
  return render(
    <IntlProvider locale={locale || "en"} messages={messages}>
      {component}
    </IntlProvider>,
  );
};

describe("Pagination tests", () => {
  test("If the total page count is less then page pills show range from 1 to totalPageCount", () => {
    const props = NoDots.args as PaginationProps;
    renderWithReactIntl(<NoDots {...props} />);
    const { result } = renderHook(() => usePagination(props)); // should return an ordered array of the pagination pages.
    const paginationRange = [1, 2, 3, 4, 5];
    expect(result.current).toStrictEqual(paginationRange); // test if paginationRange matches the result from hook.

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
    const props = RightDots.args as PaginationProps;
    renderWithReactIntl(<RightDots {...props} />);
    const { result } = renderHook(() => usePagination(props)); // should return an ordered array of the pagination pages (including the DOTS).
    const paginationRange = [1, 2, 3, 4, 5, DOTS, 10];
    expect(result.current).toStrictEqual(paginationRange); // test if page range matches result from hook.

    const pages = screen.getAllByTestId("pagination");
    const dots = screen.getAllByTestId("dots");
    expect(pages).toHaveLength(6);
    expect(dots).toHaveLength(1);
  });

  test("Should show DOTS on left side when total page count is greater then page pills", () => {
    const props = LeftDots.args as PaginationProps;
    renderWithReactIntl(<LeftDots {...props} />);
    const { result } = renderHook(() => usePagination(props)); // should return an ordered array of the pagination pages (including the DOTS).
    const paginationRange = [1, DOTS, 6, 7, 8, 9, 10]; // test if page range matches result from hook.
    expect(result.current).toStrictEqual(paginationRange);
    const pages = screen.getAllByTestId("pagination");
    const dots = screen.getAllByTestId("dots");
    expect(pages).toHaveLength(6);
    expect(dots).toHaveLength(1);
  });

  test("Should show DOTS on left and right side when total page count is greater then page pills", () => {
    const props = BothDots.args as PaginationProps;
    renderWithReactIntl(<BothDots {...props} />);
    const { result } = renderHook(() => usePagination(props)); // should return an ordered array of the pagination pages (including the DOTS).
    const paginationRange = [1, DOTS, 4, 5, 6, DOTS, 10]; // test if page range matches result from hook.
    expect(result.current).toStrictEqual(paginationRange);
    const pages = screen.getAllByTestId("pagination");
    const dots = screen.getAllByTestId("dots");
    expect(pages).toHaveLength(5);
    expect(dots).toHaveLength(2);
  });

  test("Should handle clicks on right (next) arrow buttons correctly", () => {
    const props = NoDots.args as PaginationProps;
    const handlePageChange = jest.fn();
    renderWithReactIntl(
      <NoDots {...props} onCurrentPageChange={handlePageChange} />,
    );
    const leftArrowButton = screen.getByTestId("leftArrowButton");
    const rightArrowButton = screen.getByTestId("rightArrowButton");
    expect(leftArrowButton).toBeDisabled(); // The button should be disabled since current page is the first page
    fireEvent.click(rightArrowButton);
    expect(handlePageChange).toHaveBeenCalledWith(props.currentPage + 1);
  });

  test("Should handle clicks on left (previous) arrow buttons correctly", () => {
    const props = NoDots.args as PaginationProps;
    const handlePageChange = jest.fn();
    const lastPage = 5;
    renderWithReactIntl(
      <NoDots
        {...props}
        currentPage={lastPage}
        onCurrentPageChange={handlePageChange}
      />,
    );
    const leftArrowButton = screen.getByTestId("leftArrowButton");
    const rightArrowButton = screen.getByTestId("rightArrowButton");
    expect(rightArrowButton).toBeDisabled(); // The button should be disabled since last page is the current page
    fireEvent.click(leftArrowButton);
    expect(handlePageChange).toHaveBeenCalledWith(lastPage - 1);
  });

  test("Should handle clicks on page buttons correctly", () => {
    const props = NoDots.args as PaginationProps;
    const handlePageChange = jest.fn();
    renderWithReactIntl(
      <NoDots {...props} onCurrentPageChange={handlePageChange} />,
    );
    const pageThreeButton = screen.getByText("3");
    fireEvent.click(pageThreeButton);
    expect(handlePageChange).toHaveBeenCalledWith(3);
    const pageFiveButton = screen.getByText("5");
    fireEvent.click(pageFiveButton);
    expect(handlePageChange).toHaveBeenCalledWith(5);
    const pageTwoButton = screen.getByText("2");
    fireEvent.click(pageTwoButton);
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });
});
