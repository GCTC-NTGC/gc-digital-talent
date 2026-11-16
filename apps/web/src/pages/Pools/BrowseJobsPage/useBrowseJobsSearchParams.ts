import { useSearchParams } from "react-router";

export const sortByOptions = ["datePosted", "deadline"] as const;
export type SortBy = (typeof sortByOptions)[number];

export const filterOptions = [
  "keyword",
  "applicationEligibility",
  "organization",
] as const;
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
      if (prev.has(filter, value)) return prev;
      const next = new URLSearchParams(prev);
      next.append(filter, value);
      return next;
    });

  // replace all values for a filter, an empty array clears it
  const setFilterValues = (filter: FilterOption, values: string[]) =>
    setSearchParams((prev) => {
      const unique = [...new Set(values)];
      const current = prev.getAll(filter);
      // unchanged, avoid pushing a duplicate history entry
      if (
        unique.length === current.length &&
        unique.every((value, i) => value === current[i])
      )
        return prev;
      const next = new URLSearchParams(prev);
      next.delete(filter);
      unique.forEach((value) => next.append(filter, value));
      return next;
    });

  const removeFilterValue = (filter: FilterOption, value: string) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(filter, value);
      return next;
    });

  const resetFilter = (filter: FilterOption) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(filter);
      return next;
    });

  const resetAllFilters = () =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      filterOptions.forEach((filter) => next.delete(filter));
      return next;
    });

  // number of filters with at least one value selected
  const getEnabledFilterCount = (): number =>
    filterOptions.filter((filter) => searchParams.has(filter)).length;

  return {
    sortBy,
    setSortBy,
    getFilterValues,
    addFilterValue,
    setFilterValues,
    removeFilterValue,
    resetFilter,
    resetFilters: resetAllFilters,
    getEnabledFilterCount,
  };
};

export default useBrowseJobsSearchParams;
