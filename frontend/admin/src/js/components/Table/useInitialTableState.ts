import { useMemo } from "react";

const useInitialTableState = (searchParams: URLSearchParams) => {
  const pageIndex = searchParams.get("pageIndex");
  const pageSize = searchParams.get("pageSize");
  const hiddenColumns = searchParams.get("hiddenColumns");
  const sortByEncoded = searchParams.get("sortBy");
  const sortBy = useMemo(
    () =>
      sortByEncoded ? JSON.parse(decodeURIComponent(sortByEncoded)) : undefined,
    [sortByEncoded],
  );

  return useMemo(
    () => ({
      pageIndex: pageIndex ? parseInt(pageIndex, 10) : null,
      pageSize: pageSize ? parseInt(pageSize, 10) : null,
      hiddenColumns: hiddenColumns?.split(",") || null,
      sortBy: sortBy || null,
    }),
    [pageIndex, pageSize, hiddenColumns, sortBy],
  );
};

export default useInitialTableState;
