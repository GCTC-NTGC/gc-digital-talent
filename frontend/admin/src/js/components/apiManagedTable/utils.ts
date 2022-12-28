import { SortingRule } from "./basicTableHelpers";

interface CommonTableParams<T> {
  currentPage?: number;
  pageSize?: number;
  hiddenColumnIds?: Array<string>;
  sortBy?: SortingRule<T>;
}

export const getCommonTableParams = <T>(
  searchParams: URLSearchParams,
): CommonTableParams<T> => {
  const initialPage = searchParams.get("currentPage");
  const initialPageSize = searchParams.get("pageSize");
  const initialHiddenColumns = searchParams.get("hiddenColumnIds");
  const initialSortByEncoded = searchParams.get("sortBy");
  const initialSortByDecoded = initialSortByEncoded
    ? JSON.parse(decodeURIComponent(initialSortByEncoded))
    : undefined;

  return {
    currentPage: initialPage ? parseInt(initialPage, 10) : undefined,
    pageSize: initialPageSize ? parseInt(initialPageSize, 10) : undefined,
    hiddenColumnIds: initialHiddenColumns
      ? initialHiddenColumns.split(",")
      : undefined,
    sortBy: initialSortByDecoded,
  };
};

// eslint-disable-next-line import/prefer-default-export
export const setCommonTableParams = <T>(
  currentParams: URLSearchParams,
  { pageSize, currentPage, hiddenColumnIds, sortBy }: CommonTableParams<T>,
) => {
  if (pageSize) {
    currentParams.set("pageSize", `${pageSize}`);
  }
  if (currentPage) {
    currentParams.set("currentPage", `${currentPage}`);
  }
  if (hiddenColumnIds) {
    currentParams.set("hiddenColumnIds", hiddenColumnIds.join(","));
  }

  if (sortBy) {
    const newSortBy = JSON.stringify(sortBy);
    currentParams.set("sortBy", encodeURIComponent(newSortBy));
  }

  return currentParams;
};
