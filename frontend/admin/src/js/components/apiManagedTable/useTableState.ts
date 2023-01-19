import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import isEqual from "lodash/isEqual";

import { SearchState, SortingRule } from "./basicTableHelpers";

export interface CommonTableState<T> {
  currentPage?: number;
  pageSize?: number;
  hiddenColumnIds?: Array<string>;
  sortBy?: SortingRule<T>;
  searchState?: SearchState;
}

interface TableState<T, F> extends CommonTableState<T> {
  filters?: F;
}

type DefaultState<T, F> = Partial<TableState<T, F>>;
type SetTableState<T, F> = (newState: TableState<T, F>) => void;

const setInt = (
  key: string,
  params: URLSearchParams,
  newValue?: number,
  defaultValue?: number,
) => {
  const prevValue = params.get(key);

  if (!prevValue || parseInt(prevValue, 10) !== newValue) {
    if (newValue && newValue !== defaultValue) {
      params.set(key, newValue.toString());
    } else {
      params.delete(key);
    }
  }

  return params;
};

const setArray = <T>(
  key: string,
  params: URLSearchParams,
  newValue?: Array<T>,
  defaultValue?: Array<T>,
) => {
  const prevValueEncoded = params.get(key);
  const prevValue = prevValueEncoded
    ? JSON.parse(decodeURIComponent(prevValueEncoded))
    : undefined;
  // Compare sets so that order doesn't matter
  const prevValueSet = new Set(prevValue);
  const newValueSet = new Set(newValue);
  const defaultValueSet = new Set(defaultValue);

  if (!prevValue || !isEqual(prevValueSet, newValueSet)) {
    if (newValue && !isEqual(newValueSet, defaultValueSet)) {
      params.set(key, encodeURIComponent(JSON.stringify(newValue)));
    } else {
      params.delete(key);
    }
  }

  return params;
};

const setString = (
  key: string,
  params: URLSearchParams,
  newValue?: string,
  defaultValue?: string,
) => {
  const prevValue = params.get(key);

  if (!prevValue || prevValue !== newValue) {
    if (newValue && newValue !== defaultValue) {
      params.set(key, newValue);
    } else {
      params.delete(key);
    }
  }

  return params;
};

const setEncodedJson = (
  key: string,
  params: URLSearchParams,
  newValue?: unknown,
  defaultValue?: unknown,
) => {
  const prevValueEncoded = params.get(key);
  const prevValue = prevValueEncoded
    ? JSON.parse(decodeURIComponent(prevValueEncoded))
    : undefined;

  if (!prevValue || !isEqual(prevValue, newValue)) {
    if (newValue && !isEqual(newValue, defaultValue)) {
      params.set(key, encodeURIComponent(JSON.stringify(newValue)));
    } else {
      params.delete(key);
    }
  }

  return params;
};

const useTableState = <T, F>(
  defaultState: DefaultState<T, F>,
): [state: TableState<T, F>, setState: SetTableState<T, F>] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPageParam = searchParams.get("currentPage");
  const pageSizeParam = searchParams.get("pageSize");
  const hiddenColumnsEncoded = searchParams.get("hiddenColumnIds");
  const hiddenColumnsParam = useMemo(
    () =>
      hiddenColumnsEncoded
        ? JSON.parse(decodeURIComponent(hiddenColumnsEncoded))
        : undefined,
    [hiddenColumnsEncoded],
  );
  const sortByEncoded = searchParams.get("sortBy");
  const sortByParam = useMemo(
    () =>
      sortByEncoded ? JSON.parse(decodeURIComponent(sortByEncoded)) : undefined,
    [sortByEncoded],
  );
  const searchTermParam = searchParams.get("searchTerm");
  const searchByParam = searchParams.get("searchBy");
  const filtersEncoded = searchParams.get("filters");
  const filtersParam = useMemo(
    () =>
      filtersEncoded
        ? JSON.parse(decodeURIComponent(filtersEncoded))
        : undefined,
    [filtersEncoded],
  );

  const tableState = useMemo(
    () => ({
      currentPage: currentPageParam
        ? parseInt(currentPageParam, 10)
        : defaultState.currentPage,
      pageSize: pageSizeParam
        ? parseInt(pageSizeParam, 10)
        : defaultState.pageSize,
      hiddenColumnIds: hiddenColumnsParam ?? defaultState.hiddenColumnIds,
      sortBy: sortByParam ?? defaultState.sortBy,
      searchState: {
        term: searchTermParam ?? defaultState.searchState?.term,
        type: searchByParam ?? defaultState.searchState?.type,
      },
      filters: filtersParam ?? defaultState.filters,
    }),
    [
      currentPageParam,
      filtersParam,
      hiddenColumnsParam,
      pageSizeParam,
      searchByParam,
      searchTermParam,
      sortByParam,
      defaultState,
    ],
  );

  const setTableState = (newState: Partial<TableState<T, F>>) => {
    const {
      pageSize,
      currentPage,
      hiddenColumnIds,
      searchState,
      filters,
      sortBy,
    } = {
      ...tableState,
      ...newState,
    };
    setSearchParams(
      (previous) => {
        let newParams = new URLSearchParams(previous);
        newParams = setInt(
          "pageSize",
          newParams,
          pageSize,
          defaultState.pageSize,
        );
        newParams = setInt(
          "currentPage",
          newParams,
          currentPage,
          defaultState.currentPage,
        );
        newParams = setArray(
          "hiddenColumnIds",
          newParams,
          hiddenColumnIds,
          defaultState.hiddenColumnIds,
        );
        newParams = setString(
          "searchTerm",
          newParams,
          searchState?.term,
          defaultState.searchState?.term,
        );
        newParams = setString(
          "searchBy",
          newParams,
          searchState?.type,
          defaultState.searchState?.type,
        );
        newParams = setEncodedJson(
          "sortBy",
          newParams,
          sortBy,
          defaultState.sortBy,
        );
        newParams = setEncodedJson(
          "filters",
          newParams,
          filters,
          defaultState.filters,
        );
        return newParams;
      },
      {
        replace: true,
      },
    );
  };

  return [tableState, setTableState];
};

export default useTableState;
