import { useState, SetStateAction, Dispatch, useMemo } from "react";
import {
  OnChangeFn,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  TableState,
  Updater,
  VisibilityState,
} from "@tanstack/react-table";

import useTableState from "~/hooks/useTableState";
import { SearchState } from "./types";

type UpdateStateCallback<State> = (newState: State | null) => void;

const updateState = <State>(
  setter: Dispatch<SetStateAction<State>>,
  updater: Updater<State>,
  callback?: UpdateStateCallback<State>,
) => {
  let newValue: State | null = null;
  if (updater instanceof Function) {
    setter((previous) => {
      newValue = updater(previous);
      if (callback) callback(newValue);
      return newValue;
    });
  } else {
    setter(updater);
    if (callback) callback(updater);
  }
};

const getColumnVisibility = (
  allColumnsIds: string[],
  hiddenColumnIds?: string[],
): VisibilityState => {
  const initialColumnVisibility: VisibilityState = {};
  hiddenColumnIds?.forEach((column) => {
    Object.assign(initialColumnVisibility, { [column]: false });
  });
  allColumnsIds
    .filter((columnId) => !hiddenColumnIds?.includes(columnId))
    .forEach((column) => {
      Object.assign(initialColumnVisibility, { [column]: true });
    });

  return initialColumnVisibility;
};

const getColumnFilters = (
  searchState?: SearchState,
): ColumnFiltersState | undefined => {
  const isColumnFilter = searchState?.type && searchState.type !== "";

  return isColumnFilter && searchState.type && searchState.term
    ? [
        {
          id: searchState.type,
          value: searchState.term,
        },
      ]
    : undefined;
};

type InitialState = {
  hiddenColumnIds: string[];
  paginationState: PaginationState;
  searchState: SearchState;
  sortState: SortingState;
};

const INITIAL_STATE: InitialState = {
  hiddenColumnIds: [],
  paginationState: {
    pageIndex: 0,
    pageSize: 10,
  },
  sortState: [],
  searchState: {
    term: "",
    type: "",
  },
};

type UseControlledTableStateReturn = {
  state: Partial<TableState>;
  updaters: {
    onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
    onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
    onGlobalFilterChange?: OnChangeFn<string>;
    onPaginationChange?: OnChangeFn<PaginationState>;
    onSortingChange?: OnChangeFn<SortingState>;
  };
};

type UseControlledTableStateArgs = {
  initialState: Partial<InitialState>;
  columnIds: string[];
};

type UseControlledTableState = (
  args: UseControlledTableStateArgs,
) => UseControlledTableStateReturn;

/**
 * Controlled Table State
 *
 * This controls the state for the table using the `updateState`
 * wrapper which allows for a callback to run side effects.
 *
 * @param initialState  Initial state of the table
 * @returns UseControlledTableStateReturn Contains the state and updaters
 */
const useControlledTableState: UseControlledTableState = ({
  initialState,
  columnIds,
}) => {
  const [tableState, setTableState] = useTableState<InitialState, unknown>(
    initialState,
  );

  const [globalFilter, setGlobalFilter] = useState<string>(
    tableState.searchState?.term ??
      initialState.searchState?.term ??
      INITIAL_STATE.searchState.term ??
      "",
  );

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    getColumnFilters(initialState.searchState) ?? [],
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    getColumnVisibility(
      columnIds,
      tableState.hiddenColumnIds ?? initialState.hiddenColumnIds,
    ),
  );

  const [sorting, setSorting] = useState<SortingState>(
    INITIAL_STATE.sortState ?? [],
  );

  const [pagination, setPagination] = useState<PaginationState>(
    INITIAL_STATE.paginationState,
  );

  const handleGlobalFilterChange = (updater: Updater<string>) =>
    updateState(setGlobalFilter, updater, (newTerm) => {
      setTableState({
        searchState: {
          term: newTerm === null ? INITIAL_STATE.searchState.term : newTerm,
          type: "",
        },
      });
    });

  const handleColumnFiltersChange = (updater: Updater<ColumnFiltersState>) =>
    updateState(setColumnFilters, updater, (newFilters) => {
      const newFilter = newFilters ? newFilters[0] : null;

      const term = newFilter
        ? String(newFilter.value)
        : INITIAL_STATE.searchState.term;

      setTableState({
        searchState: {
          type: newFilter ? newFilter.id : INITIAL_STATE.searchState.type,
          term: term ?? "",
        },
      });
    });

  const handleVisibilityChange = (updater: Updater<VisibilityState>) =>
    updateState(setColumnVisibility, updater, (newVisibility) => {
      setTableState({
        hiddenColumnIds:
          newVisibility === null
            ? []
            : Object.keys(newVisibility ?? {}).filter(
                (key) => !newVisibility[key],
              ),
      });
    });

  const handleSortingChange = (updater: Updater<SortingState>) =>
    updateState(setSorting, updater, (newSorting) => {
      // TO DO: Refactor to match `react-table` `SortingState`
      setTableState({
        sortBy: newSorting
          ? {
              desc: newSorting[0].desc,
              column: {
                id: newSorting[0].id,
              },
            }
          : undefined,
      });
    });

  const handlePaginationChange = (updater: Updater<PaginationState>) =>
    updateState(setPagination, updater, (newPagination) => {
      setTableState({
        pageSize:
          newPagination?.pageSize ?? INITIAL_STATE.paginationState.pageSize,
        currentPage:
          (newPagination?.pageIndex ??
            INITIAL_STATE.paginationState.pageIndex) + 1,
      });
    });

  const memoizedState: Partial<TableState> = useMemo(
    () => ({
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
      sorting,
    }),
    [columnFilters, columnVisibility, globalFilter, pagination, sorting],
  );

  return {
    state: memoizedState,
    updaters: {
      onColumnFiltersChange: handleColumnFiltersChange,
      onColumnVisibilityChange: handleVisibilityChange,
      onPaginationChange: handlePaginationChange,
      onGlobalFilterChange: handleGlobalFilterChange,
      onSortingChange: handleSortingChange,
    },
  };
};

export default useControlledTableState;
