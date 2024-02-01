import React from "react";
import { useIntl } from "react-intl";
import { Table } from "@tanstack/react-table";

import Pagination from "~/components/Pagination";

import { PaginationDef } from "./types";

interface TablePaginationProps<T> {
  pagination: PaginationDef;
  table: Table<T>;
}

const TablePagination = <T,>({
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

  const tablePaginationState = table.getState().pagination;

  return (
    <Pagination
      data-h2-margin-top="base(x1) l-tablet(x.5)"
      color="black"
      ariaLabel={intl.formatMessage({
        defaultMessage: "Page navigation",
        description: "Label for the table pagination",
        id: "N3sUUc",
      })}
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
