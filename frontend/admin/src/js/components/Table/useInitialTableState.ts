import { useMemo } from "react";

const useInitialTableState = (searchParams: URLSearchParams) => {
  const pageIndex = searchParams.get("pageIndex");
  const pageSize = searchParams.get("pageSize");
  const hiddenColumns = searchParams.get("hiddenColumns");
  const sortByEncoded = searchParams.get("sortBy");
  const sortBy = sortByEncoded
    ? JSON.parse(decodeURIComponent(sortByEncoded))
    : undefined;

  return useMemo(
    () => ({
      pageIndex: pageIndex ? parseInt(pageIndex, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      hiddenColumns: hiddenColumns?.split(",") || undefined,
      sortBy: sortBy || undefined,
    }),
    [pageIndex, pageSize, hiddenColumns, sortBy],
  );
};

export default useInitialTableState;
