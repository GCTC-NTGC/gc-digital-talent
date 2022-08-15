import React, { ReactElement } from "react";
import { useIntl } from "react-intl";
import Pagination from "@common/components/Pagination";
import Pending from "@common/components/Pending";
import { Button } from "@common/components";
import { DownloadCsv, type DownloadCsvProps } from "@common/components/Link";
import { CombinedError } from "urql";
import { Spacer } from "../Table/tableComponents";
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
      data-h2-align-items="b(center)"
      data-h2-display="b(flex)"
      data-h2-bg-color="b(lightgray)"
      data-h2-justify-content="b(space-between)"
      data-h2-radius="b(none, none, s, s)"
      data-h2-padding="b(all, s)"
    >
      {hasSelection && (
        <div
          data-h2-display="b(flex)"
          data-h2-align-items="b(center)"
          data-h2-margin="b(right, s)"
        >
          <p>
            {intl.formatMessage({
              defaultMessage: "Selected actions:",
              description: "Label for action buttons in footer of admin table.",
            })}
          </p>
          <Pending fetching={fetchingSelected} error={selectionError} inline>
            {csv && (
              <Spacer>
                <DownloadCsv
                  type="button"
                  mode="solid"
                  color="primary"
                  disabled={disableActions}
                  {...csv}
                >
                  {intl.formatMessage({
                    defaultMessage: "Download CSV",
                    description:
                      "Text label for button to download an csv file of items in a table.",
                  })}
                </DownloadCsv>
              </Spacer>
            )}

            <Spacer>
              <Button
                type="button"
                mode="solid"
                color="primary"
                disabled={disableActions}
                onClick={onPrint}
              >
                {intl.formatMessage({
                  defaultMessage: "Print",
                  description:
                    "Text label for button to print items in a table.",
                })}
              </Button>
            </Spacer>
          </Pending>
        </div>
      )}
      <Pagination
        currentPage={paginatorInfo.currentPage}
        onCurrentPageChange={onCurrentPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSize={paginatorInfo.perPage}
        pageSizes={[10, 20, 30, 40, 50]}
        totalCount={paginatorInfo.total}
        ariaLabel={intl.formatMessage({ defaultMessage: "Table results" })}
        color="black"
        mode="outline"
        data-h2-margin="b(all, none)"
      />
    </div>
  );
}

export default TableFooter;
