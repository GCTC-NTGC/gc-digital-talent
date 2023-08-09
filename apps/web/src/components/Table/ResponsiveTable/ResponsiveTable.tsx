import * as React from "react";
import omit from "lodash/omit";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { notEmpty } from "@gc-digital-talent/helpers";

import Table from "./Table";
import SearchForm from "./SearchForm";
import ColumnDialog from "./ColumnDialog";
import NullMessage, { NullMessageProps } from "./NullMessage";
import RowSelection, { getRowSelectionColumn } from "./RowSelection";

import type {
  DatasetDownload,
  DatasetPrint,
  RowSelect,
  SearchDef,
  SearchState,
} from "./types";

interface TableProps<TData> {
  /** Accessible name for the table */
  caption: React.ReactNode;
  /** Data to be displayed within the table */
  data: TData[];
  /** Column definitions for `react-table` */
  columns: ColumnDef<TData>[];
  /** Determine if any aspect of the table is loading (server side) */
  isLoading?: boolean;
  /** Override default null message with a custom one */
  nullMessage?: NullMessageProps;
  /** Enable row selection */
  rowSelect?: RowSelect<TData>;
  /** Enable the search form */
  search?: SearchDef<typeof SearchForm>;
  /** Enable printing selected rows (requires rowSelect) */
  print?: DatasetPrint;
  /** Enable downloading selected rows and/or all data (requires rowSelect) */
  download?: DatasetDownload;
}

const ResponsiveTable = <TData extends object>({
  caption,
  data,
  columns,
  isLoading,
  nullMessage,
  rowSelect,
  search,
  download,
  print,
}: TableProps<TData>) => {
  const id = React.useId();
  const memoizedData = React.useMemo(() => data, [data]);
  const memoizedColumns = React.useMemo(() => {
    if (!rowSelect) return columns;

    return [getRowSelectionColumn(rowSelect.cell), ...columns];
  }, [columns, rowSelect]);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const isInternalSearch = search && search.internal;

  React.useEffect(() => {
    if (rowSelect?.onRowSelection) {
      const selectedRows = Object.values(rowSelection)
        .map((value, index) => {
          return value ? memoizedData[index] : undefined;
        })
        .filter(notEmpty);

      rowSelect.onRowSelection(selectedRows);
    }
    // Note: This is probably due to mis-use of useEffect but
    // adding exhaustive deps causes this to run infinitely
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: {
      rowSelection,
      columnVisibility,
      globalFilter: searchTerm,
    },
    enableRowSelection: !!rowSelect,
    enableGlobalFilter: isInternalSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection, // Note: We should probably do the state sync here
    onGlobalFilterChange: setSearchTerm,
    onColumnVisibilityChange: setColumnVisibility,
  });

  const handleSearchChange = (newSearchState: SearchState) => {
    if (search) {
      setSearchTerm(newSearchState?.term || "");
      if (search.onChange) {
        search.onChange(newSearchState);
      }
    }
  };

  const hasNoData = !isLoading && (!memoizedData || memoizedData.length === 0);
  const captionId = `${id}-caption`;

  return (
    <>
      <Table.Controls>
        {search && (
          <SearchForm
            onChange={handleSearchChange}
            {...omit(search, "onChange")}
          />
        )}
        <ColumnDialog table={table} />
      </Table.Controls>
      {!hasNoData ? (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        <Table.Wrapper aria-labelledby={captionId} tabIndex={0}>
          <Table.Table>
            <Table.Caption id={captionId}>{caption}</Table.Caption>
            <Table.Head>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.HeadRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.HeadCell key={header.id} header={header} />
                  ))}
                </Table.HeadRow>
              ))}
            </Table.Head>
            <Table.Body>
              {table.getRowModel().rows.map((row) => (
                <Table.Row key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id} cell={cell} />
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Table>
          {rowSelect && (
            <RowSelection.Actions
              {...{
                download,
                print,
                isLoading,
                count: Object.values(rowSelection).length,
                onClear: () => table.resetRowSelection(),
              }}
            />
          )}
        </Table.Wrapper>
      ) : (
        <NullMessage {...(nullMessage ? { ...nullMessage } : {})} />
      )}
    </>
  );
};

export default ResponsiveTable;
