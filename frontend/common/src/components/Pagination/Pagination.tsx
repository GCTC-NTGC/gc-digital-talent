import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/solid";
import * as React from "react";
import { useIntl } from "react-intl";
import { Button } from "..";
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
  /** Callback that changes to the page number value. */
  handlePageChange: (pageNumber: number) => void;
}

const Pagination: React.FunctionComponent<PaginationProps> = ({
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  handlePageChange,
  ...rest
}) => {
  const intl = useIntl();
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

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
    <nav
      role="navigation"
      aria-label={intl.formatMessage({
        defaultMessage: "Pagination Navigation",
        description: "Aria label for pagination nav",
      })}
    >
      <ul
        className="reset-ul"
        data-h2-display="b(flex)"
        data-h2-align-items="b(center)"
        {...rest}
      >
        {/* left navigation arrow */}
        <li>
          <Button
            classNames={isLeftArrowDisabled ? "disabled" : ""}
            color="primary"
            mode="outline"
            type="button"
            disabled={isLeftArrowDisabled}
            aria-disabled={isLeftArrowDisabled}
            aria-label={intl.formatMessage({
              defaultMessage: "Goto previous page",
              description:
                "Aria label for previous page button in pagination nav",
            })}
            onClick={previousPage}
            data-h2-margin="b(right, xs)"
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
                data-h2-margin="b(right-left, xs)"
                data-h2-font-color="b(lightpurple)"
                data-testid="dots"
              >
                <DotsHorizontalIcon style={{ width: "1.125rem" }} />
              </li>
            );
          }
          const current = pageNumber === currentPage;
          return (
            <li key={`${pageNumber}-pageNumber`}>
              <Button
                data-testid="pagination"
                color="primary"
                mode={`${current ? "solid" : "outline"}`}
                type="button"
                aria-label={intl.formatMessage(
                  {
                    defaultMessage: "Goto Page {pageNumber}",
                    description: "Aria label for each button in pagination nav",
                  },
                  { pageNumber },
                )}
                aria-current={current}
                onClick={() => handlePageChange(Number(pageNumber))}
                data-h2-margin="b(right-left, xs)"
              >
                {pageNumber}
              </Button>
            </li>
          );
        })}
        {/* right navigation arrow */}
        <li>
          <Button
            classNames={isRightArrowDisabled ? "disabled" : ""}
            color="primary"
            mode="outline"
            type="button"
            disabled={isRightArrowDisabled}
            aria-disabled={isRightArrowDisabled}
            aria-label={intl.formatMessage({
              defaultMessage: "Goto next page",
              description: "Aria label for next page button in pagination nav",
            })}
            onClick={nextPage}
            data-h2-margin="b(left, xs)"
            data-testid="rightArrowButton"
          >
            <ArrowRightIcon style={{ width: "1.125rem" }} />
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
