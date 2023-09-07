import React, { ReactElement } from "react";
import { useIntl } from "react-intl";
import { CombinedError } from "urql";

import {
  Pending,
  DownloadCsv,
  type DownloadCsvProps,
} from "@gc-digital-talent/ui";

import Pagination from "~/components/Pagination";
import { PaginatorInfo } from "~/api/generated";

type Csv = Pick<DownloadCsvProps, "headers" | "data" | "fileName">;
interface TableFooterProps {
  paginatorInfo?: PaginatorInfo;
  onCurrentPageChange: (n: number) => void;
  onPageSizeChange: (n: number) => void;
  onPrint?: () => void;
  csv?: Csv;
  additionalActions?: React.ReactNode;
  hasSelection?: boolean;
  disableActions?: boolean;
  fetchingSelected?: boolean;
  selectionError?: CombinedError;
}

const defaultPaginationInfo = {
  count: 0,
  currentPage: 1,
  hasMorePages: false,
  lastPage: 1,
  perPage: 1,
  total: 0,
};

function TableFooter({
  paginatorInfo = defaultPaginationInfo,
  onCurrentPageChange,
  onPageSizeChange,
  csv,
  additionalActions,
  hasSelection = false,
  fetchingSelected = false,
  selectionError,
}: TableFooterProps): ReactElement {
  const intl = useIntl();

  return (
    <div
      data-h2-background-color="base(black)"
      data-h2-radius="base(0px, 0px, rounded, rounded)"
    >
      <div data-h2-padding="base(x1, x1)">
        <div data-h2-flex-grid="base(center, x2, 0)">
          <div data-h2-flex-item="base(content)">
            {hasSelection && (
              <div
                data-h2-flex-grid="base(center, x1, 0)"
                data-h2-position="base(relative)"
              >
                <Pending
                  fetching={fetchingSelected}
                  error={selectionError}
                  inline
                >
                  {csv && (
                    <div data-h2-flex-item="base(content)">
                      <DownloadCsv
                        type="button"
                        mode="inline"
                        color="white"
                        {...csv}
                      >
                        {intl.formatMessage({
                          defaultMessage: "Download CSV",
                          id: "mxOuYK",
                          description:
                            "Text label for button to download a csv file of items in a table.",
                        })}
                      </DownloadCsv>
                    </div>
                  )}
                  {additionalActions && (
                    <div data-h2-flex-item="base(content)">
                      {additionalActions}
                    </div>
                  )}
                </Pending>
              </div>
            )}
          </div>
          <div data-h2-flex-item="base(fill)">
            <Pagination
              currentPage={paginatorInfo.currentPage}
              onCurrentPageChange={onCurrentPageChange}
              onPageSizeChange={onPageSizeChange}
              pageSize={paginatorInfo.perPage}
              pageSizes={[10, 20, 50, 100, 500]}
              totalCount={paginatorInfo.total}
              totalPages={paginatorInfo.total / paginatorInfo.perPage}
              color="white"
              activeColor="quaternary"
              ariaLabel={intl.formatMessage({
                defaultMessage: "Table results",
                id: "hlcd+5",
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableFooter;
