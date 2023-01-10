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
  const prevValue = params.get(key);
  if (!prevValue || !isEqual(prevValue.split(","), newValue)) {
    if (newValue && !isEqual(newValue, defaultValue)) {
      params.set(key, newValue.toString());
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

  console.log({
    newValue,
    defaultValue,
    prevValue,
    preNotEquals: prevValue !== newValue,
    defaultNotEquals: newValue !== defaultValue,
  });

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
  const hiddenColumnsParam = searchParams.get("hiddenColumnIds");
  const sortByEncoded = searchParams.get("sortBy");
  const sortByParam = sortByEncoded
    ? JSON.parse(decodeURIComponent(sortByEncoded))
    : undefined;
  const searchTermParam = searchParams.get("searchTerm");
  const searchByParam = searchParams.get("searchBy");
  const filtersEncoded = searchParams.get("filters");
  const filtersParam = filtersEncoded
    ? JSON.parse(decodeURIComponent(filtersEncoded))
    : undefined;

  const tableState = useMemo(
    () => ({
      currentPage: currentPageParam
        ? parseInt(currentPageParam, 10)
        : defaultState.currentPage,
      pageSize: pageSizeParam
        ? parseInt(pageSizeParam, 10)
        : defaultState.pageSize,
      hiddenColumnIds: hiddenColumnsParam
        ? hiddenColumnsParam.split(",")
        : defaultState.hiddenColumnIds,
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

  const setTableState = (newState: DefaultState<T, F>) => {
    const mergedState = {
      ...tableState,
      ...newState,
    };
    const {
      pageSize,
      currentPage,
      hiddenColumnIds,
      searchState,
      filters,
      sortBy,
    } = mergedState;
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
