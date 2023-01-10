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
  filters: F;
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
    if (newValue && newValue !== defaultValue) {
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

  if (!prevValue || prevValue !== newValue) {
    if (newValue && newValue !== defaultValue) {
      params.set(key, newValue);
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

  const setTableState = (newState: TableState<T, F>) => {
    const { pageSize, currentPage, hiddenColumnIds, searchState } = newState;
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
        return newParams;
      },
      {
        replace: true,
      },
    );
  };

  const tableState = useMemo(
    () => ({
      currentPage: currentPageParam
        ? parseInt(currentPageParam, 10)
        : undefined,
      pageSize: pageSizeParam ? parseInt(pageSizeParam, 10) : undefined,
      hiddenColumnIds: hiddenColumnsParam
        ? hiddenColumnsParam.split(",")
        : undefined,
      sortBy: sortByParam,
      searchState: {
        term: searchTermParam || "",
        type: searchByParam || "",
      },
      filters: filtersParam,
    }),
    [
      currentPageParam,
      filtersParam,
      hiddenColumnsParam,
      pageSizeParam,
      searchByParam,
      searchTermParam,
      sortByParam,
    ],
  );

  return [tableState, setTableState];
};

export default useTableState;
