import { Button } from "@common/components";
import React, { ReactElement } from "react";
import { useIntl } from "react-intl";
import Pagination from "@common/components/Pagination";
import { Spacer } from "../Table/tableComponents";
import { PaginatorInfo } from "../../api/generated";

export interface TableFooterProps {
  paginatorInfo?: PaginatorInfo;
  onCurrentPageChange: (n: number) => void;
  onPageSizeChange: (n: number) => void;
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
}: TableFooterProps): ReactElement {
  const intl = useIntl();

  return (
    <div
      data-h2-background-color="base(dt-secondary.light)"
      data-h2-radius="base(0px, 0px, s, s)"
    >
      {/* <p>
          {intl.formatMessage({
            defaultMessage: "Selected actions:",
            description: "Label for action buttons in footer of admin table.",
          })}
        </p> */}
      <div data-h2-padding="base(x1, x.75)">
        <div data-h2-flex-grid="base(center, 0, x2, 0)">
          <div data-h2-flex-item="base(content)">
            <div data-h2-flex-grid="base(center, 0, x1, 0)">
              {/* <div data-h2-flex-item="base(content)">
                <div
                  data-h2-position="base(relative)"
                  data-h2-padding="base(x.45)"
                  data-h2-border="base(all, 1px, solid, dt-white)"
                >
                  <span
                    data-h2-color="base(dt-white)"
                    data-h2-font-weight="base(700)"
                    data-h2-display="base(block)"
                    data-h2-position="base(center)"
                    data-h2-margin="base(1px, 0, 0, 0)"
                  >
                    3
                  </span>
                </div>
              </div> */}
              <div data-h2-flex-item="base(content)">
                <Button type="button" mode="inline" color="white">
                  {intl.formatMessage({
                    defaultMessage: "Download XML",
                    description:
                      "Text label for button to download an xml file of items in a table.",
                  })}
                </Button>
              </div>
              <div data-h2-flex-item="base(content)">
                <Button type="button" mode="inline" color="white">
                  {intl.formatMessage({
                    defaultMessage: "Download PDF",
                    description:
                      "Text label for button to download a pdf of items in a table.",
                  })}
                </Button>
              </div>
            </div>
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
