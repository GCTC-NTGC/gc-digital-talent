import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/solid";
import * as React from "react";
import { useIntl } from "react-intl";
import { Button } from "..";
import { Color } from "../Button";
import { DOTS, usePagination } from "./usePagination";

export interface PaginationProps {
  /** The current active page. */
  currentPage: number;
  /** Total count of items from array. */
  totalCount: number;
  /** The minimum number of page buttons to be shown on each side of the current page button. */
  siblingCount?: number;
  /** The maximum number of visible items on a single page. */
  pageSize: number;
  /** List of page sizes (max num of visible items on a single page) */
  pageSizes?: number[];
  /** A unique, descriptive ARIA label for the <nav> element */
  ariaLabel: string;
  /** Button font color */
  color: Color;
  /** Button mode type  */
  mode: "solid" | "outline" | "inline";
  /** Callback that changes to the page number value. */
  handlePageChange: (pageNumber: number) => void;
  /** Callback that changes max number of visible items on a single page */
  handlePageSize: (pageSize: number) => void;
}

const Pagination: React.FunctionComponent<PaginationProps> = ({
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  pageSizes,
  ariaLabel,
  color,
  mode,
  handlePageChange,
  handlePageSize,
  ...rest
}) => {
  const intl = useIntl();
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });
  const totalPageCount = Math.ceil(totalCount / pageSize);

  // If there are less than 2 times in pagination range we shall not render the component
  const lessThanTwoItems = currentPage === 0 || paginationRange.length < 2;

  const nextPage = () => {
    handlePageChange(currentPage + 1);
  };

  const previousPage = () => {
    handlePageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];
  const isLeftArrowDisabled = currentPage === 1;
  const isRightArrowDisabled = currentPage === lastPage;
  return (
    <div
      data-h2-padding="b(x.5)"
      data-h2-display="b(flex)"
      data-h2-align-items="b(center)"
      data-h2-flex-direction="b(column) s(row)"
    >
      <nav
        role="navigation"
        aria-label={ariaLabel}
        data-h2-margin="b(auto, auto, x.5, auto) s(auto, x.5, auto, auto)"
      >
        <ul
          className="reset-ul"
          data-h2-display="b(flex)"
          data-h2-align-items="b(center)"
          data-h2-margin="b(0, auto, auto, auto)"
          {...rest}
        >
          {/* left navigation arrow */}
          <li data-h2-margin="b(0)">
            <Button
              classNames={
                isLeftArrowDisabled || lessThanTwoItems ? "disabled" : ""
              }
              color={color}
              mode={mode}
              type="button"
              disabled={isLeftArrowDisabled || lessThanTwoItems}
              aria-disabled={isLeftArrowDisabled || lessThanTwoItems}
              aria-label={intl.formatMessage({
                defaultMessage: "Goto previous page",
                description:
                  "Aria label for previous page button in pagination nav",
              })}
              onClick={previousPage}
              data-h2-margin="b(auto, x.125, auto, auto)"
              data-h2-padding="b(x.125, x.25)"
              data-testid="leftArrowButton"
            >
              <ArrowLeftIcon style={{ width: "1.125rem" }} />
            </Button>
          </li>
          {paginationRange.map((pageNumber, index) => {
            // If the pageItem is a DOT, render the DOTS unicode character
            if (pageNumber === DOTS) {
              return (
                <li
                  key={`${index + 1}-dots`}
                  data-h2-display="b(flex)"
                  data-h2-margin="b(0, x.25)"
                  data-testid="dots"
                >
                  <DotsHorizontalIcon style={{ width: "1.125rem" }} />
                </li>
              );
            }
            const current = pageNumber === currentPage;
            return (
              <li
                key={`${pageNumber}-pageNumber`}
                data-h2-margin="b(0)"
              >
                <Button
                  classNames={lessThanTwoItems ? "disabled" : ""}
                  data-testid="pagination"
                  color={color}
                  mode={`${current ? "solid" : mode}`}
                  type="button"
                  disabled={lessThanTwoItems}
                  aria-label={intl.formatMessage(
                    {
                      defaultMessage: "Goto Page {pageNumber}",
                      description:
                        "Aria label for each button in pagination nav",
                    },
                    { pageNumber },
                  )}
                  aria-current={current}
                  onClick={() => handlePageChange(Number(pageNumber))}
                  data-h2-margin="b(auto, x.125)"
                  data-h2-padding="b(x.125, x.25)"
                >
                  {pageNumber}
                </Button>
              </li>
            );
          })}
          {/* right navigation arrow */}
          <li data-h2-margin="b(0)">
            <Button
              classNames={
                isRightArrowDisabled || lessThanTwoItems ? "disabled" : ""
              }
              color={color}
              mode={mode}
              type="button"
              disabled={isRightArrowDisabled || lessThanTwoItems}
              aria-disabled={isRightArrowDisabled || lessThanTwoItems}
              aria-label={intl.formatMessage({
                defaultMessage: "Goto next page",
                description:
                  "Aria label for next page button in pagination nav",
              })}
              onClick={nextPage}
              data-h2-margin="b(auto, auto, auto, x.125)"
              data-h2-padding="b(x.125, x.25)"
              data-testid="rightArrowButton"
            >
              <ArrowRightIcon style={{ width: "1.125rem" }} />
            </Button>
          </li>
        </ul>
      </nav>
      <div data-h2-margin="b(auto, auto, x.5, auto) s(auto, x.5, auto, auto)">
        <span>
          {intl.formatMessage({
            defaultMessage: "Go to page:",
            description: "Label for pagination input in admin table.",
          })}{" "}
          <input
            type="number"
            value={currentPage}
            onChange={(e) => {
              const p = e.target.value ? Number(e.target.value) : 0;
              handlePageChange(p);
            }}
            disabled={lessThanTwoItems}
            min={1}
            max={totalPageCount}
            style={{ width: "65px" }}
          />
        </span>
      </div>
      {pageSizes && (
        <select
          style={{ cursor: "pointer" }}
          value={pageSize}
          onChange={(e) => {
            handlePageSize(Number(e.target.value));
          }}
        >
          {pageSizes.map((numOfRows) => (
            <option key={numOfRows} value={numOfRows}>
              {intl.formatMessage(
                {
                  defaultMessage: "Show {numOfRows}",
                  description:
                    "Options for how many rows to show on admin table",
                },
                { numOfRows },
              )}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default Pagination;
