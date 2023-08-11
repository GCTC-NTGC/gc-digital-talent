import { useState, SetStateAction, Dispatch, useMemo } from "react";
import {
  OnChangeFn,
  VisibilityState,
  Updater,
  TableState,
  ColumnFiltersState,
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

const getGlobalFilter = (searchState?: SearchState): string | undefined => {
  const isColumnFilter = searchState?.type && searchState.type !== "";

  return isColumnFilter ? undefined : searchState?.term;
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
  searchState: SearchState;
};

const INITIAL_STATE: InitialState = {
  hiddenColumnIds: [],
  searchState: {
    term: "",
    type: "",
  },
};

type UseControlledTableStateReturn = {
  state: Partial<TableState>;
  updaters: {
    onColumnVisibilityChange: OnChangeFn<VisibilityState>;
    onGlobalFilterChange: OnChangeFn<string>;
    // onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
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
 * TO DO: Create side effects to store state changes in searchParams
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

  const [, setGlobalFilter] = useState<string>(
    tableState.searchState?.term ??
      initialState.searchState?.term ??
      INITIAL_STATE.searchState.term ??
      "",
  );

  const [, setColumnFilters] = useState<ColumnFiltersState>(
    getColumnFilters(initialState.searchState) ?? [],
  );

  const [, setColumnVisibility] = useState<VisibilityState>(
    getColumnVisibility(
      columnIds,
      tableState.hiddenColumnIds ?? initialState.hiddenColumnIds,
    ),
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

  // NOTE: Having trouble with this at the moment with the single input
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const stateFromParams: Partial<TableState> = useMemo(
    () => ({
      columnVisibility: getColumnVisibility(
        columnIds,
        tableState.hiddenColumnIds,
      ),
      globalFilter: getGlobalFilter(tableState.searchState),
      // columnFilters: getColumnFilters(tableState.searchState),
    }),
    [columnIds, tableState.hiddenColumnIds, tableState.searchState],
  );

  return {
    state: stateFromParams,
    updaters: {
      onGlobalFilterChange: handleGlobalFilterChange,
      onColumnVisibilityChange: handleVisibilityChange,
      // onColumnFiltersChange: handleColumnFiltersChange,
    },
  };
};

export default useControlledTableState;
