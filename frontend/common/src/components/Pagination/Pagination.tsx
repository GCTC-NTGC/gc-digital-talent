import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
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
  onCurrentPageChange: (pageNumber: number) => void;
  /** Callback that changes max number of visible items on a single page */
  onPageSizeChange: (pageSize: number) => void;
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
  onCurrentPageChange,
  onPageSizeChange,
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
    onCurrentPageChange(currentPage + 1);
  };

  const previousPage = () => {
    onCurrentPageChange(currentPage - 1);
  };

  let fontColor = {};
  if (color === "black") {
    fontColor = { "data-h2-color": "base(dt-black)" };
  } else if (color === "white") {
    fontColor = { "data-h2-color": "base(dt-white)" };
  }

  const lastPage = paginationRange[paginationRange.length - 1];
  const isLeftArrowDisabled = currentPage === 1;
  const isRightArrowDisabled = currentPage === lastPage;
  return (
    <div>
      <div
        data-h2-flex-grid="base(center, x2, x1)"
        data-h2-justify-content="base(flex-end)"
      >
        <div data-h2-flex-item="base(content)">
          <nav role="navigation" aria-label={ariaLabel}>
            <ul
              data-h2-display="base(flex)"
              data-h2-gap="base(x.25)"
              className="reset-ul"
              {...rest}
            >
              {/* left navigation arrow */}
              <li data-h2-display="base(inline-block)">
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
                    id: "drr0f7",
                    description:
                      "Aria label for previous page button in pagination nav",
                  })}
                  onClick={previousPage}
                  data-testid="leftArrowButton"
                  data-h2-padding="base(x.85)"
                  data-h2-position="base(relative)"
                >
                  <ArrowLeftIcon
                    data-h2-position="base(center)"
                    data-h2-display="base(block)"
                    data-h2-height="base(x.8)"
                  />
                </Button>
              </li>
              {paginationRange.map((pageNumber, index) => {
                // If the pageItem is a DOT, render the DOTS unicode character
                if (pageNumber === DOTS) {
                  return (
                    <li
                      key={`${index + 1}-dots`}
                      data-h2-display="base(flex)"
                      data-h2-align-items="base(center)"
                      data-h2-padding="base(0, x.5)"
                      data-testid="dots"
                    >
                      <span
                        data-h2-display="base(block)"
                        data-h2-margin="base(-x.5, 0, 0, 0)"
                        data-h2-font-size="base(h6, 1)"
                        data-h2-font-weight="base(700)"
                        {...fontColor}
                      >
                        ...
                      </span>
                    </li>
                  );
                }
                const current = pageNumber === currentPage;
                return (
                  <li
                    key={`${pageNumber}-pageNumber`}
                    data-h2-display="base(inline-block)"
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
                          id: "Rv5vo7",
                          description:
                            "Aria label for each button in pagination nav",
                        },
                        { pageNumber },
                      )}
                      aria-current={current}
                      onClick={() => onCurrentPageChange(Number(pageNumber))}
                      data-h2-padding="base(x.85)"
                      data-h2-position="base(relative)"
                    >
                      <span
                        data-h2-position="base(center)"
                        data-h2-display="base(block)"
                        data-h2-height="base(x1)"
                      >
                        {pageNumber}
                      </span>
                    </Button>
                  </li>
                );
              })}
              {/* right navigation arrow */}
              <li data-h2-display="base(inline-block)">
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
                    id: "4uiPHx",
                    description:
                      "Aria label for next page button in pagination nav",
                  })}
                  onClick={nextPage}
                  data-testid="rightArrowButton"
                  data-h2-padding="base(x.85)"
                  data-h2-position="base(relative)"
                >
                  <ArrowRightIcon
                    data-h2-position="base(center)"
                    data-h2-display="base(block)"
                    data-h2-height="base(x.8)"
                  />
                </Button>
              </li>
            </ul>
          </nav>
        </div>
        <div data-h2-flex-item="base(content)">
          <div data-h2-flex-grid="base(center, x2, 0)">
            <div data-h2-flex-item="base(content)">
              <label data-h2-font-size="base(copy)" {...fontColor}>
                {intl.formatMessage({
                  defaultMessage: "Go to page:",
                  id: "QdXUwo",
                  description: "Label for pagination input in admin table.",
                })}{" "}
                <input
                  type="number"
                  value={currentPage}
                  onChange={(e) => {
                    const p = e.target.value ? Number(e.target.value) : 0;
                    onCurrentPageChange(p);
                  }}
                  disabled={lessThanTwoItems}
                  min={1}
                  max={totalPageCount}
                  style={{ width: "65px" }}
                />
              </label>
            </div>
            <div data-h2-flex-item="base(content)">
              {pageSizes && (
                <select
                  style={{ cursor: "pointer" }}
                  value={pageSize}
                  aria-label={intl.formatMessage({
                    defaultMessage: "Page size",
                    id: "fSBslq",
                    description:
                      "Label for the number of items to display on each page.",
                  })}
                  onChange={(e) => {
                    onPageSizeChange(Number(e.target.value));
                  }}
                >
                  {pageSizes.map((numOfRows) => (
                    <option key={numOfRows} value={numOfRows}>
                      {intl.formatMessage(
                        {
                          defaultMessage: "Show {numOfRows}",
                          id: "pbXAOp",
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
