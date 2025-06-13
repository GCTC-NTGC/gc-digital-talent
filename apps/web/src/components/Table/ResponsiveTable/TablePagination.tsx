import { useIntl } from "react-intl";
import { PaginationState, Table } from "@tanstack/react-table";

import Pagination from "~/components/Pagination";

import { PaginationDef } from "./types";

interface TablePaginationProps<T> {
  label: string;
  pagination: PaginationDef;
  table: Table<T>;
}

const TablePagination = <T,>({
  label,
  pagination,
  table,
}: TablePaginationProps<T>) => {
  const intl = useIntl();

  const handlePageSizeChange = (newPageSize: number) => {
    if (pagination) {
      table.setPageSize(newPageSize);
      if (pagination.onPaginationChange) {
        pagination.onPaginationChange({
          pageIndex: table.getState().pagination.pageIndex + 1,
          pageSize: newPageSize,
        });
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (pagination) {
      const newPageIndex = newPage - 1;
      table.setPageIndex(newPageIndex);

      if (pagination.onPaginationChange) {
        pagination.onPaginationChange({
          pageIndex: newPageIndex + 1,
          pageSize: table.getState().pagination.pageSize,
        });
      }
    }
  };

  let currentPageIndex = 0;
  if (
    !pagination?.internal &&
    typeof pagination?.state?.pageIndex !== "undefined"
  ) {
    const externalPageIndex = pagination.state.pageIndex - 1;
    currentPageIndex = externalPageIndex < 0 ? 0 : externalPageIndex;
  }

  const tablePaginationState: PaginationState =
    !pagination.internal && pagination.state
      ? {
          pageIndex: currentPageIndex,
          pageSize: pagination.state.pageSize,
        }
      : table.getState().pagination;

  return (
    <Pagination
      className="mt-6 sm:mt-3"
      color="black"
      ariaLabel={intl.formatMessage(
        {
          defaultMessage: "{label} page navigation",
          description: "Label for the table pagination",
          id: "RRlKyW",
        },
        { label },
      )}
      currentPage={tablePaginationState.pageIndex + 1}
      pageSize={tablePaginationState.pageSize}
      pageSizes={pagination.pageSizes}
      totalCount={pagination.total}
      totalPages={
        table.getPageCount() ??
        Math.ceil(pagination?.total ?? 0 / tablePaginationState.pageSize)
      }
      onPageSizeChange={handlePageSizeChange}
      onCurrentPageChange={handlePageChange}
    />
  );
};

export default TablePagination;
