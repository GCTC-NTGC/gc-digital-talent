import React, { ReactElement } from "react";
import { useIntl } from "react-intl";
import { CombinedError } from "urql";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";

import {
  Pending,
  Button,
  DownloadCsv,
  type DownloadCsvProps,
  DropdownMenu,
} from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";

import Pagination from "~/components/Pagination";
import { PaginatorInfo } from "~/api/generated";

type Csv = Pick<DownloadCsvProps, "headers" | "data" | "fileName">;
interface TableFooterProps {
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

  const handlePrint = () => {
    if (disableActions) {
      toast.error(
        intl.formatMessage({
          defaultMessage: "Download failed: No rows selected",
          id: "k4xm25",
          description:
            "Alert message displayed when a user attempts to print without selecting items first",
        }),
      );
    } else if (onPrint) {
      onPrint();
    }
  };

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
                  <div data-h2-flex-item="base(content)">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button
                          mode="inline"
                          color="white"
                          utilityIcon={ChevronDownIcon}
                        >
                          {intl.formatMessage({
                            defaultMessage: "Print profiles",
                            id: "QIjKF4",
                            description:
                              "Text label for button to print items in a table",
                          })}
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.RadioGroup
                          value="1"
                          onValueChange={() => {}}
                        >
                          <DropdownMenu.RadioItem
                            key="identifying"
                            value="identifying"
                          >
                            <DropdownMenu.ItemIndicator>
                              <CheckIcon />
                            </DropdownMenu.ItemIndicator>
                            Profiles include identifying information
                          </DropdownMenu.RadioItem>
                          <DropdownMenu.RadioItem
                            key="no-identifying"
                            value="no-identifying"
                          >
                            <DropdownMenu.ItemIndicator>
                              <CheckIcon />
                            </DropdownMenu.ItemIndicator>
                            Profiles do not include identifying information
                          </DropdownMenu.RadioItem>
                        </DropdownMenu.RadioGroup>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
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
