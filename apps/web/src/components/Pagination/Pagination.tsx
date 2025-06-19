import { useIntl } from "react-intl";
import ChevronDoubleLeftIcon from "@heroicons/react/24/solid/ChevronDoubleLeftIcon";
import ChevronLeftIcon from "@heroicons/react/24/solid/ChevronLeftIcon";
import ChevronDoubleRightIcon from "@heroicons/react/24/solid/ChevronDoubleRightIcon";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

import { Button, ButtonProps, DropdownMenu } from "@gc-digital-talent/ui";

import { DOTS, usePagination } from "./usePagination";
import PageButton from "./PageButton";

const pagination = tv({
  base: "flex flex-col items-center gap-y-6 text-sm sm:flex-row sm:gap-x-3 sm:gap-y-0",
  variants: {
    spacing: {
      between: "justify-between",
      start: "justify-start",
      end: "justify-end",
    },
    color: {
      black: "text-black dark:text-white",
      white: "text-white dark:text-black",
    },
  },
  defaultVariants: {
    spacing: "between",
  },
});

const icon = tv({
  base: "size-4 align-middle",
});

const pageBtn = tv({
  base: "",
  variants: {
    current: {
      true: "underline",
      false: "font-normal no-underline",
    },
  },
});

type ActiveColor = ButtonProps["color"];

export interface PaginationProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /** The current active page. */
  currentPage: number;
  /** Total count of items from array. */
  totalCount?: number;
  /** Total count of pages from array. */
  totalPages: number;
  /** The minimum number of page buttons to be shown on each side of the current page button. */
  siblings?: number;
  /** The maximum number of visible items on a single page. */
  pageSize: number;
  /** List of page sizes (max num of visible items on a single page) */
  pageSizes?: number[];
  /** A unique, descriptive ARIA label for the <nav> element */
  ariaLabel: string;
  /** Default button colour */
  color: "white" | "black";
  /** Active button colour */
  activeColor?: ActiveColor;
  /** Callback that changes to the page number value. */
  onCurrentPageChange: (pageNumber: number) => void;
  /** Callback that changes max number of visible items on a single page */
  onPageSizeChange: (pageSize: number) => void;
  /** Control the spacing between controls */
  spacing?: "start" | "between" | "end";
}

const Pagination = ({
  totalCount = 0,
  totalPages,
  siblings = 1,
  currentPage,
  pageSize,
  pageSizes,
  ariaLabel,
  onCurrentPageChange,
  onPageSizeChange,
  spacing,
  color,
  activeColor = "black",
  className,
  ...rest
}: PaginationProps) => {
  const intl = useIntl();
  const paginationRange = usePagination({
    currentPage,
    totalPages,
    siblings,
  });

  // If there are less than 2 times in pagination range we shall not render the component
  const lessThanTwoItems = currentPage === 0 || paginationRange.length < 2;

  const nextPage = () => {
    onCurrentPageChange(currentPage + 1);
  };

  const previousPage = () => {
    onCurrentPageChange(currentPage - 1);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    onCurrentPageChange(1);
    onPageSizeChange(Number(newPageSize));
  };

  const lastPage = paginationRange[paginationRange.length - 1];
  const isLeftArrowDisabled = currentPage === 1;
  const isRightArrowDisabled = currentPage === lastPage;
  const currentPageStartIndex = (currentPage - 1) * pageSize + 1;
  const currentPageSize = currentPage * pageSize;

  return (
    <div className={pagination({ color, spacing, class: className })} {...rest}>
      <div className="flex items-center gap-x-3">
        <span>
          {intl.formatMessage(
            {
              defaultMessage:
                "Showing results {currentPageStartIndex} - {currentPageEndIndex} of {total}",
              id: "CsPyAD",
              description:
                "Description of how many items are being displayed out of the total value",
            },
            {
              currentPageStartIndex,
              currentPageEndIndex:
                currentPageSize > totalCount ? totalCount : currentPageSize,
              total: totalCount,
            },
          )}
        </span>
        {pageSizes && (
          <>
            {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
            <span aria-hidden>&bull;</span>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button
                  mode="text"
                  size="sm"
                  color={color}
                  utilityIcon={ChevronDownIcon}
                  className="-mt-px"
                >
                  {intl.formatMessage(
                    {
                      defaultMessage: "Show {pageSize}",
                      id: "JgdijS",
                      description:
                        "Button text to change the number of items that show up on each page",
                    },
                    { pageSize },
                  )}
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.RadioGroup
                  value={String(pageSize)}
                  onValueChange={handlePageSizeChange}
                >
                  {pageSizes.map((size) => (
                    <DropdownMenu.RadioItem key={size} value={String(size)}>
                      <DropdownMenu.ItemIndicator>
                        <CheckIcon />
                      </DropdownMenu.ItemIndicator>
                      {size}
                    </DropdownMenu.RadioItem>
                  ))}
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </>
        )}
      </div>
      <nav role="navigation" aria-label={ariaLabel}>
        <ul className="flex items-center gap-x-3">
          <li>
            <PageButton
              color={color}
              disabled={isLeftArrowDisabled || lessThanTwoItems}
              aria-label={intl.formatMessage({
                defaultMessage: "Go to first page",
                id: "n+tkit",
                description: "Label for first page button in pagination nav",
              })}
              onClick={() => onCurrentPageChange(1)}
            >
              <ChevronDoubleLeftIcon className={icon()} />
            </PageButton>
          </li>
          <li>
            <PageButton
              disabled={isLeftArrowDisabled || lessThanTwoItems}
              onClick={previousPage}
              color={color}
              aria-label={intl.formatMessage({
                defaultMessage: "Go to previous page",
                id: "yGy+to",
                description:
                  "Aria label for previous page button in pagination nav",
              })}
            >
              <ChevronLeftIcon className={icon()} />
            </PageButton>
          </li>

          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              // eslint-disable-next-line formatjs/no-literal-string-in-jsx
              return <li key={`dots-${index + 1}`}>&hellip;</li>;
            }

            const current = pageNumber === currentPage;

            return (
              <li key={pageNumber}>
                <PageButton
                  disabled={lessThanTwoItems}
                  aria-current={current}
                  onClick={() => onCurrentPageChange(Number(pageNumber))}
                  color={current ? activeColor : color}
                  className={pageBtn({ current })}
                  aria-label={intl.formatMessage(
                    {
                      defaultMessage: "Go to page {pageNumber}",
                      id: "rLd5cC",
                      description:
                        "Aria label for each button in pagination nav",
                    },
                    { pageNumber },
                  )}
                >
                  {pageNumber}
                </PageButton>
              </li>
            );
          })}

          <li>
            <PageButton
              disabled={isRightArrowDisabled || lessThanTwoItems}
              onClick={nextPage}
              color={color}
              aria-label={intl.formatMessage({
                defaultMessage: "Go to next page",
                id: "O5dDCM",
                description:
                  "Aria label for next page button in pagination nav",
              })}
            >
              <ChevronRightIcon className={icon()} />
            </PageButton>
          </li>
          <li>
            <PageButton
              disabled={isRightArrowDisabled || lessThanTwoItems}
              color={color}
              onClick={() => onCurrentPageChange(totalPages)}
              aria-label={intl.formatMessage({
                defaultMessage: "Go to last page",
                id: "qtCt+G",
                description: "Label for last page button in pagination nav",
              })}
            >
              <ChevronDoubleRightIcon className={icon()} />
            </PageButton>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
