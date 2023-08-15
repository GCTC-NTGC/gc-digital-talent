import { useState, SetStateAction, Dispatch, useMemo, useRef } from "react";
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

const useTableSateFromSearchParams = (
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
  if (pageSizeParam) {
    state = {
      ...state,
      paginationState: {
        pageIndex:
          state.paginationState?.pageIndex ??
          initialState?.paginationState?.pageIndex ??
          INITIAL_STATE.paginationState.pageSize,
        pageSize: Number(pageSizeParam),
      },
    };
  }

  const pageIndexParam = params.get(SEARCH_PARAM_KEY.PAGE);
  if (pageIndexParam) {
    state = {
      ...state,
      paginationState: {
        pageSize:
          state.paginationState?.pageSize ??
          initialState?.paginationState?.pageSize ??
          INITIAL_STATE.paginationState.pageSize,
        pageIndex: Number(pageIndexParam) - 1,
      },
    };
  }

  return state;
};

type UseControlledTableStateReturn = {
  initialState: Partial<InitialState>;
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
  const initialStateFromParams = useTableSateFromSearchParams(initialState);
  const stableInitialState = useRef<Partial<InitialState>>(
    initialStateFromParams,
  );

  const [globalFilter, setGlobalFilter] = useState<string>(
    stableInitialState.current.searchState?.term ?? "",
  );

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    getColumnFilters(stableInitialState.current.searchState) ?? [],
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    getColumnVisibility(columnIds, stableInitialState.current.hiddenColumnIds),
  );

  const [sorting, setSorting] = useState<SortingState>(
    stableInitialState.current.sortState ?? INITIAL_STATE.sortState,
  );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex:
      stableInitialState.current.paginationState?.pageIndex ??
      INITIAL_STATE.paginationState.pageIndex,
    pageSize:
      stableInitialState.current.paginationState?.pageSize ??
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
    initialState: stableInitialState.current,
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
