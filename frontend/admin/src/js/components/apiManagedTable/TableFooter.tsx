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
      data-h2-align-items="b(center)"
      data-h2-display="b(flex)"
      data-h2-bg-color="b(lightgray)"
      data-h2-justify-content="b(space-between)"
      data-h2-radius="b(none, none, s, s)"
      data-h2-padding="b(all, s)"
    >
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
        <Spacer>
          <Button type="button" mode="solid" color="primary">
            {intl.formatMessage({
              defaultMessage: "Download XML",
              description:
                "Text label for button to download an xml file of items in a table.",
            })}
          </Button>
        </Spacer>
        <Spacer>
          <Button type="button" mode="solid" color="primary">
            {intl.formatMessage({
              defaultMessage: "Download PDF",
              description:
                "Text label for button to download a pdf of items in a table.",
            })}
          </Button>
        </Spacer>
      </div>

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
