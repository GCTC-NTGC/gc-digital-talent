import React, { ReactElement } from "react";
import { useIntl } from "react-intl";
import Pagination from "@common/components/Pagination";
import Pending from "@common/components/Pending";
import { Button } from "@common/components";
import { DownloadCsv, type DownloadCsvProps } from "@common/components/Link";
import { CombinedError } from "urql";
import { PaginatorInfo } from "../../api/generated";

type Csv = Pick<DownloadCsvProps, "headers" | "data" | "fileName">;
export interface TableFooterProps {
  paginatorInfo?: PaginatorInfo;
  onCurrentPageChange: (n: number) => void;
  onPageSizeChange: (n: number) => void;
  onPrint?: () => void;
  csv?: Csv;
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
  onPrint,
  csv,
  disableActions,
  hasSelection = false,
  fetchingSelected = false,
  selectionError,
}: TableFooterProps): ReactElement {
  const intl = useIntl();

  return (
    <div
      data-h2-background-color="base(dt-secondary.light)"
      data-h2-radius="base(0px, 0px, s, s)"
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
                        disabled={disableActions}
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
                  <div data-h2-flex-item="base(content)">
                    <Button
                      type="button"
                      mode="inline"
                      color="white"
                      disabled={disableActions}
                      onClick={onPrint}
                    >
                      {intl.formatMessage({
                        defaultMessage: "Print",
                        id: "pLCv50",
                        description:
                          "Text label for button to print items in a table.",
                      })}
                    </Button>
                  </div>
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
              pageSizes={[10, 20, 30, 40, 50]}
              totalCount={paginatorInfo.total}
              ariaLabel={intl.formatMessage({
                defaultMessage: "Table results",
                id: "hlcd+5",
              })}
              color="white"
              mode="outline"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableFooter;
