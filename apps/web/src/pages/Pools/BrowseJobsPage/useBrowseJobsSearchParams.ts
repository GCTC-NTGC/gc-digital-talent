import { useSearchParams } from "react-router";

export const sortByOptions = ["datePosted", "deadline"] as const;
export type SortBy = (typeof sortByOptions)[number];

export const filterOptions = [
  "keyword",
  "applicationEligibility",
  "organization",
  "classification",
  "advertisementTiming",
  "languageRequirement",
  "minimumSalary",
  "processNumber",
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

  const getFilterValue = (filter: FilterOption): string | null =>
    searchParams.get(filter);

  const getFilterValues = (filter: FilterOption): string[] =>
    searchParams.getAll(filter);

  const addFilterValue = (filter: FilterOption, value: string) =>
    setSearchParams((prev) => {
      if (prev.has(filter, value)) return prev;
      const next = new URLSearchParams(prev);
      next.append(filter, value);
      return next;
    });

  /**
   * Update several filters in a single navigation.
   * setSearchParams doesn't chain like useState, so separate calls in the
   * same tick overwrite each other. A string or array replaces the filter's
   * values, null or an empty array clears it, and omitted filters are untouched.
   */
  const setFilters = (
    updates: Partial<Record<FilterOption, string | string[] | null>>,
  ) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([filter, value]) => {
        next.delete(filter);
        const values = Array.isArray(value) ? value : value ? [value] : [];
        [...new Set(values)].forEach((v) => next.append(filter, v));
      });
      // unchanged, avoid pushing a duplicate history entry
      if (next.toString() === prev.toString()) return prev;
      return next;
    });

  const removeFilterValue = (filter: FilterOption, value: string) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(filter, value);
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
    getFilterValue,
    getFilterValues,
    addFilterValue,
    setFilters,
    removeFilterValue,
    resetFilters: resetAllFilters,
    getEnabledFilterCount,
  };
};

export default useBrowseJobsSearchParams;
