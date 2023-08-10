import * as React from "react";
import { useIntl } from "react-intl";
import ChevronDoubleLeftIcon from "@heroicons/react/24/solid/ChevronDoubleLeftIcon";
import ChevronLeftIcon from "@heroicons/react/24/solid/ChevronLeftIcon";
import ChevronDoubleRightIcon from "@heroicons/react/24/solid/ChevronDoubleRightIcon";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";

import { Button, Color, DropdownMenu } from "@gc-digital-talent/ui";

import { DOTS, usePagination } from "./usePagination";
import PageButton from "./PageButton";

type ButtonColor = Extract<Color, "white" | "black">;
type ActiveColor = Exclude<Color, "white" | "black">;

export interface PaginationProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
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
  color: ButtonColor;
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
  activeColor = "primary",
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

  const iconStyles = {
    "data-h2-width": "base(1rem)",
    "data-h2-height": "base(1rem)",
    "data-h2-vertical-align": "base(middle)",
  };

  const fontColor =
    color === "white"
      ? {
          "data-h2-color": "base(white)",
        }
      : {
          "data-h2-color": "base(black)",
        };

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column) l-tablet(row)"
      data-h2-align-items="base(center)"
      data-h2-justify-content="base(space-between)"
      data-h2-gap="base(x.5 0) l-tablet(0 x.5)"
      data-h2-font-size="base(caption)"
      {...(spacing === "start" && {
        "data-h2-justify-content": "base(flex-start)",
      })}
      {...(spacing === "end" && {
        "data-h2-justify-content": "base(flex-end)",
      })}
      {...fontColor}
      {...rest}
    >
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-gap="base(0 x.25)"
      >
        <span>
          {intl.formatMessage(
            {
              defaultMessage: "Showing results {pageSize} of {total}",
              id: "gMWuvj",
              description:
                "Description of how many items are being displayed out of the total value",
            },
            {
              pageSize: pageSize > totalCount ? totalCount : pageSize,
              total: totalCount,
            },
          )}
        </span>
        {pageSizes && (
          <>
            <span aria-hidden>&bull;</span>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button
                  mode="inline"
                  color={color}
                  utilityIcon={ChevronDownIcon}
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
        <ul
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-gap="base(0 x.5)"
          data-h2-list-style="base(none)"
          data-h2-padding="base(0)"
        >
          <li>
            <PageButton
              color={color}
              disabled={isLeftArrowDisabled || lessThanTwoItems}
              aria-label={intl.formatMessage({
                defaultMessage: "Goto first page",
                id: "+Y3v3/",
                description: "Label for first page button in pagination nav",
              })}
              onClick={() => onCurrentPageChange(1)}
            >
              <ChevronDoubleLeftIcon {...iconStyles} />
            </PageButton>
          </li>
          <li>
            <PageButton
              disabled={isLeftArrowDisabled || lessThanTwoItems}
              onClick={previousPage}
              color={color}
              aria-label={intl.formatMessage({
                defaultMessage: "Goto previous page",
                id: "drr0f7",
                description:
                  "Aria label for previous page button in pagination nav",
              })}
            >
              <ChevronLeftIcon {...iconStyles} />
            </PageButton>
          </li>

          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
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
                  aria-label={intl.formatMessage(
                    {
                      defaultMessage: "Goto Page {pageNumber}",
                      id: "Rv5vo7",
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
                defaultMessage: "Goto next page",
                id: "4uiPHx",
                description:
                  "Aria label for next page button in pagination nav",
              })}
            >
              <ChevronRightIcon {...iconStyles} />
            </PageButton>
          </li>
          <li>
            <PageButton
              disabled={isRightArrowDisabled || lessThanTwoItems}
              color={color}
              onClick={() => onCurrentPageChange(totalPages - 1)}
              aria-label={intl.formatMessage({
                defaultMessage: "Goto last page",
                id: "vNcmiU",
                description: "Label for last page button in pagination nav",
              })}
            >
              <ChevronDoubleRightIcon {...iconStyles} />
            </PageButton>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
