import { useSearchParams } from "react-router";

export const sortByOptions = ["datePosted", "deadline"] as const;
export type SortBy = (typeof sortByOptions)[number];

export const filterOptions = ["exampleFilter"] as const;
export type FilterOption = (typeof filterOptions)[number];

const SORT_BY_PARAM = "sortBy";
const DEFAULT_SORT_BY: SortBy = "datePosted";

const isSortBy = (value: string | null): value is SortBy =>
  sortByOptions.some((option) => option === value);

/**
 * Sort and filter state for the browse jobs page, stored in the URL search params
 */
const useBrowseJobsSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawSortBy = searchParams.get(SORT_BY_PARAM);
  const sortBy: SortBy = isSortBy(rawSortBy) ? rawSortBy : DEFAULT_SORT_BY;

  const setSortBy = (value: SortBy) => {
    // already selected, avoid pushing a duplicate history entry
    if (value === sortBy) return;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(SORT_BY_PARAM, value);
      return next;
    });
  };

  const getFilterValues = (filter: FilterOption): string[] =>
    searchParams.getAll(filter);

  const addFilterValue = (filter: FilterOption, value: string) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.append(filter, value);
      return next;
    });

  const removeFilterValue = (filter: FilterOption, value: string) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(filter, value);
      return next;
    });

  const resetFilters = () =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      filterOptions.forEach((filter) => next.delete(filter));
      return next;
    });

  return {
    sortBy,
    setSortBy,
    getFilterValues,
    addFilterValue,
    removeFilterValue,
    resetFilters,
  };
};

export default useBrowseJobsSearchParams;
