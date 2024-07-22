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

import { InitialState } from "./types";
import { INITIAL_STATE, SEARCH_PARAM_KEY } from "./constants";
import { getColumnVisibility, getColumnFilters } from "./utils";

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

export const getTableStateFromSearchParams = (
  initialState?: Partial<InitialState>,
): Partial<InitialState> => {
  const params = new URLSearchParams(window.location.search);
  let state: Partial<InitialState> = initialState ?? {};

  const columnVisibilityParam = params.get(SEARCH_PARAM_KEY.HIDDEN_COLUMNS);
  if (columnVisibilityParam) {
    state = {
      ...state,
      hiddenColumnIds: columnVisibilityParam?.split(","),
    };
  }

  const searchTermParam = params.get(SEARCH_PARAM_KEY.SEARCH_TERM);
  if (searchTermParam) {
    state = {
      ...state,
      searchState: {
        ...state.searchState,
        term: searchTermParam,
      },
    };
  }

  const searchColumnParam = params.get(SEARCH_PARAM_KEY.SEARCH_COLUMN);
  if (searchColumnParam) {
    state = {
      ...state,
      searchState: {
        ...state.searchState,
        type: searchColumnParam,
      },
    };
  }

  const sortRuleParam = params.get(SEARCH_PARAM_KEY.SORT_RULE);
  if (sortRuleParam) {
    state = {
      ...state,
      sortState: JSON.parse(sortRuleParam),
    };
  }

  const pageSizeParam = params.get(SEARCH_PARAM_KEY.PAGE_SIZE);
  const pageIndexParam = params.get(SEARCH_PARAM_KEY.PAGE);
  if (pageSizeParam || pageIndexParam) {
    state = {
      ...state,
      paginationState: {
        pageIndex: pageIndexParam
          ? Number(pageIndexParam) - 1
          : (initialState?.paginationState?.pageIndex ??
            INITIAL_STATE.paginationState.pageIndex),
        pageSize: pageSizeParam
          ? Number(pageSizeParam)
          : (initialState?.paginationState?.pageSize ??
            INITIAL_STATE.paginationState.pageSize),
      },
    };
  }

  return state;
};

type UseControlledTableStateReturn = {
  initialParamState: Partial<InitialState>;
  initialState: Partial<TableState>;
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
  const initialStateFromParams = getTableStateFromSearchParams(initialState);

  const [globalFilter, setGlobalFilter] = useState<string>(
    initialStateFromParams.searchState?.term ?? "",
  );

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    getColumnFilters(initialStateFromParams.searchState) ?? [],
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    getColumnVisibility(columnIds, initialStateFromParams.hiddenColumnIds),
  );

  const [sorting, setSorting] = useState<SortingState>(
    initialStateFromParams.sortState ?? INITIAL_STATE.sortState,
  );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex:
      initialStateFromParams.paginationState?.pageIndex ??
      INITIAL_STATE.paginationState.pageIndex,
    pageSize:
      initialStateFromParams.paginationState?.pageSize ??
      INITIAL_STATE.paginationState.pageSize,
  });

  const handleGlobalFilterChange = (updater: Updater<string>) =>
    updateState(setGlobalFilter, updater);

  const handleColumnFiltersChange = (updater: Updater<ColumnFiltersState>) =>
    updateState(setColumnFilters, updater);

  const handleVisibilityChange = (updater: Updater<VisibilityState>) =>
    updateState(setColumnVisibility, updater);

  const handleSortingChange = (updater: Updater<SortingState>) =>
    updateState(setSorting, updater);

  const handlePaginationChange = (updater: Updater<PaginationState>) =>
    updateState(setPagination, updater);

  const memoizedInitialState: Partial<TableState> = useMemo(
    () => ({
      columnFilters: getColumnFilters(initialStateFromParams.searchState),
      globalFilter: initialStateFromParams.searchState?.term,
      columnVisibility: getColumnVisibility(
        columnIds,
        initialStateFromParams.hiddenColumnIds,
      ),
      pagination: initialStateFromParams.paginationState,
      sorting: initialStateFromParams.sortState ?? INITIAL_STATE.sortState,
    }),
    [
      columnIds,
      initialStateFromParams.hiddenColumnIds,
      initialStateFromParams.paginationState,
      initialStateFromParams.searchState,
      initialStateFromParams.sortState,
    ],
  );

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
    initialParamState: initialStateFromParams,
    initialState: memoizedInitialState,
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
